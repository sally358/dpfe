import Dexie, { Table } from "dexie";
import { ConfigValue1, migrateConfig1to2 } from "./db-migration";

export type DbItem = {
  id?: number;
  name0: string;
  name1: string;
  name2: string;
  name3: string;
  isGroup: 0;
  value: unknown;
};

export type DbGroup = {
  id?: number;
  name0: string;
  name1: string;
  name2: string;
  name3: string;
  isGroup: 1;
};

const cloneValue = (value: unknown): unknown => {
  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value);
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
      key,
      cloneValue(entryValue),
    ])
  );
};

const normalizeItem = (item: DbItem | DbGroup): DbItem | DbGroup => {
  if (item.isGroup) {
    return item;
  }

  return {
    ...item,
    value: cloneValue(item.value),
  };
};

class DesktopPostflopDB extends Dexie {
  public ranges!: Table<DbItem | DbGroup, number>;
  public configurations!: Table<DbItem | DbGroup, number>;
  public locks!: Table<DbItem | DbGroup, number>;

  public constructor() {
    super("DesktopPostflopDB");

    this.version(1).stores({
      ranges: "++id, [name0+name1+name2+name3+isGroup]",
      configurations: "++id, [name0+name1+name2+name3+isGroup]"
    });

    this.version(2)
      .stores({
        ranges: "++id, [name0+name1+name2+name3+isGroup]",
        configurations: "++id, [name0+name1+name2+name3+isGroup]"
      })
      .upgrade((tx) => {
        return tx
          .table("configurations")
          .toCollection()
          .modify((item: DbItem | DbGroup) => {
            if (!item.isGroup) {
              item.value = migrateConfig1to2(item.value as ConfigValue1);
            }
          });
      });
    
    this.version(3).stores({
      ranges: "++id, [name0+name1+name2+name3+isGroup]",
      configurations: "++id, [name0+name1+name2+name3+isGroup]",
      locks: "++id, [name0+name1+name2+name3+isGroup]"
    });
  }
}

const db = new DesktopPostflopDB();

const makeParent = (item: DbItem | DbGroup) => {
  if (item.name3 !== "") {
    return { ...item, name3: "", isGroup: 1 };
  } else if (item.name2 !== "") {
    return { ...item, name2: "", isGroup: 1 };
  } else if (item.name1 !== "") {
    return { ...item, name1: "", isGroup: 1 };
  } else {
    throw new Error("Cannot make parent of top-level item");
  }
};

const makeRenamed = (item: DbItem | DbGroup, newName: string) => {
  if (item.name3 !== "") {
    return { ...item, name3: newName };
  } else if (item.name2 !== "") {
    return { ...item, name2: newName };
  } else if (item.name1 !== "") {
    return { ...item, name1: newName };
  } else {
    return { ...item, name0: newName };
  }
};

export const getArray = async (store: string) => {
  return (await db.table(store).toArray()) as (DbItem | DbGroup)[];
};

export const addItem = async (store: string, item: DbItem) => {
  try {
    const table = db.table(store);
    const normalizedItem = normalizeItem(item) as DbItem;

    return await db.transaction("rw", table, async () => {
      // duplicate check
      const count = await table
        .where("[name0+name1+name2+name3]")
        .equals([normalizedItem.name0, normalizedItem.name1, normalizedItem.name2, normalizedItem.name3])
        .count();
      if (count > 0) {
        return false;
      }

      // parent check
      if (normalizedItem.name1 !== "") {
        const parent = makeParent(normalizedItem);
        const count = await table
          .where("[name0+name1+name2+name3+isGroup]")
          .equals([parent.name0, parent.name1, parent.name2, parent.name3, 1])
          .count();
        if (count !== 1) {
          return false;
        }
      }

      // insert
      await table.add(normalizedItem);

      return true;
    });
  } catch {
    return false;
  }
};

export const overwriteItem = async (store: string, item: DbItem) => {
  try {
    const table = db.table(store);
    const normalizedItem = normalizeItem(item) as DbItem;

    return await db.transaction("rw", table, async () => {
      // get collection
      const collection = table
        .where("[name0+name1+name2+name3+isGroup]")
        .equals([normalizedItem.name0, normalizedItem.name1, normalizedItem.name2, normalizedItem.name3, 0]);

      // check if exists
      if ((await collection.count()) !== 1) {
        return false;
      }

      // update
      return (await collection.modify({ value: normalizedItem.value })) === 1;
    });
  } catch {
    return false;
  }
};

export const renameItem = async (
  store: string,
  item: DbItem | DbGroup,
  newName: string
) => {
  try {
    const table = db.table(store);

    return await db.transaction("rw", table, async () => {
      const renamed = makeRenamed(item, newName);

      // duplicate check
      const count = await table
        .where("[name0+name1+name2+name3]")
        .equals([renamed.name0, renamed.name1, renamed.name2, renamed.name3])
        .count();
      if (count > 0) {
        return false;
      }

      const [index, key, modifier] =
        item.name3 !== ""
          ? [
              "[name0+name1+name2+name3]",
              [item.name0, item.name1, item.name2, item.name3],
              { name3: newName },
            ]
          : item.name2 !== ""
          ? [
              "[name0+name1+name2]",
              [item.name0, item.name1, item.name2],
              { name2: newName },
            ]
          : item.name1 !== ""
          ? ["[name0+name1]", [item.name0, item.name1], { name1: newName }]
          : ["name0", item.name0, { name0: newName }];

      // update
      return (await table.where(index).equals(key).modify(modifier)) > 0;
    });
  } catch {
    return false;
  }
};

export const addGroup = async (store: string, group: DbGroup) => {
  if (group.name3 !== "") {
    return false;
  }

  try {
    const table = db.table(store);

    return await db.transaction("rw", table, async () => {
      // duplicate check
      const count = await table
        .where("[name0+name1+name2+name3]")
        .equals([group.name0, group.name1, group.name2, group.name3])
        .count();
      if (count > 0) {
        return false;
      }

      // parent check
      if (group.name1 !== "") {
        const parent = makeParent(group);
        const count = await table
          .where("[name0+name1+name2+name3+isGroup]")
          .equals([parent.name0, parent.name1, parent.name2, parent.name3, 1])
          .count();
        if (count !== 1) {
          return false;
        }
      }

      // insert
      await table.add(group);

      return true;
    });
  } catch {
    return false;
  }
};

export const deleteItem = async (store: string, item: DbItem | DbGroup) => {
  try {
    const table = db.table(store);

    return await db.transaction("rw", table, async () => {
      if (item.isGroup) {
        // check if exists
        const count = await table
          .where("[name0+name1+name2+name3+isGroup]")
          .equals([item.name0, item.name1, item.name2, item.name3, 1])
          .count();
        if (count !== 1) {
          return false;
        }

        const [index, key] =
          item.name2 !== ""
            ? ["[name0+name1+name2]", [item.name0, item.name1, item.name2]]
            : item.name1 !== ""
            ? ["[name0+name1]", [item.name0, item.name1]]
            : ["name0", item.name0];

        // delete
        return (await table.where(index).equals(key).delete()) > 0;
      } else {
        // get collection
        const collection = table
          .where("[name0+name1+name2+name3+isGroup]")
          .equals([item.name0, item.name1, item.name2, item.name3, 0]);

        // check if exists
        if ((await collection.count()) !== 1) {
          return false;
        }

        // delete
        return (await collection.delete()) === 1;
      }
    });
  } catch {
    return false;
  }
};

export const bulkAdd = async (store: string, items: (DbItem | DbGroup)[]) => {
  try {
    const table = db.table(store);
    const normalizedItems = items.map(normalizeItem);

    return await db.transaction("rw", table, async () => {
      // insert
      await table.bulkAdd(normalizedItems);

      return true;
    });
  } catch {
    return false;
  }
};
