desktop postflop foldem edition. fork of https://github.com/b-inary/desktop-postflop.

added sally features:
* strategy breakdown by hand types (it is calculated on the fly lmao no rusty solver updates needed)
* drill exporter (technically useless for mere mortals rn because the only thing that can play exported drills is my crappy personal replayer)
* icm support (seems to work well, but I'm still not sure)
* nodelocking and rulelocking.


On the nodelocking rulelocking update: rule locks allow you to set up generic rules (board texture, turn / river cards, made hand class, board nut hands, draws, hand types and other criteria) to:
a) precisely select and nodelock specific hands, since the range currently support locking generic hands like AKs or 72o,
b) extrepolate nodelocks on all potential turn and river outcomes while preserving logic


planned next update:
* exporting
* blocker info
* batch solving
* batch viewing
* finally saving icm configs
* an easy nodelocking tree draft creator


planned features:
* PKO stuff
* 6-max support
* mega drills. drill exports works, but we may or may not want to add a built-in driller.


Don't expect any of this any time soon, only when i'll have inpiration and volition. Maybe november. Maybe january. Maybe around year 2030. Maybe I'll slip on a banana peel tomorrow and die (again) and there will never be any updates. Who knows.


---

# Desktop Postflop

> [!IMPORTANT]
> **As of October 2023, I have started developing a poker solver as a business and have decided to suspend development of this open-source project. See [this issue] for more information.**

[this issue]: https://github.com/b-inary/postflop-solver/issues/46

---

**Desktop Postflop** is a free, open-source GTO solver for Texas hold'em poker.

This is a port of [WASM Postflop] to a native desktop application using the [Tauri] framework.
Since WASM Postflop works on web browsers, it is more suitable for casual use.
However, if you want to use the solver for more serious purposes, please consider trying Desktop Postflop.

[WASM Postflop]: https://github.com/b-inary/wasm-postflop
[Tauri]: https://tauri.app/

**Related repositories**
- Solver engine: ~~https://github.com/b-inary/postflop-solver~~ https://github.com/sally358/postflop-solver-dpfe

## Comparison to WASM Postflop

- **Shared features**:
  - Free to use and open-source
  - Same solver engine and user interface
- **Advantages**:
  - Faster computation
  - Able to use more than 4GB of memory
- **Disadvantages**:
  - Needs to download the program and trust the execution
  - macOS builds are not distributed (you need to build the app yourself)

See the [WASM Postflop repository] for more detailed comparisons, including some commercial solvers.

[Original DP WASM Postflop repository]: https://github.com/b-inary/wasm-postflop#comparison

## Supported environments

- OS
  - Windows: 10/11
  - macOS: 11.7 and later
    - We do not distribute macOS builds because we are not enrolled in the Apple Developer Program and cannot sign the app (please see the "Build" section below and build it yourself).
  - Linux: glibc 2.31 and later (e.g., Ubuntu 20.04 and later)
- CPU
  - x86-64: ~~must support AVX2 instructions~~
    - Intel: Haswell (2013) and later
    - AMD: Zen (1st gen; 2017) and later
    - If you have a CPU ~~without~~ with AVX2 support, you can modify `src-tauri/.cargo/config.toml` and build it yourself. *I have no idea what these instructions do, but you can investigate it by yourself.*
  - Apple silicon: M1 and later

## Download

You will be able to download versions 0.3.0 of the app from the [GitHub releases page].

[GitHub releases page]: ~~https://github.com/b-inary/desktop-postflop/releases~~ https://github.com/sally358/dpfe/releases

Versions below 0.3.0 do not feature pre-compiled installers.

- Windows
  - The installer version (.msi) automatically installs dependent runtimes.
  - The portable version (.exe) requires the [WebView2 runtime] to be installed.
    - In most cases, the runtime should already be installed on Windows 10/11.
- Linux
  - AppImage should work on most Linux distributions.
  - Alternatively, the .deb package is available for Debian-based distributions, including Ubuntu.

[WebView2 runtime]: https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section

## Uninstall

On Windows, please remove the following folder after the regular uninstallation to completely uninstall Desktop Postflop:

```
C:\Users\<username>\AppData\Local\b-inary.desktop-postflop
```

## Build

[Rust] and [Node.js] need to be installed to build.
On Linux, you will also need to install some dependencies; please see the [Tauri documentation] for details.
~~For better performance, we also recommend installing the Rust nightly channel:~~
Nightly rust is mandatory:

```sh
$ rustup install nightly
$ rustup default nightly
```

Then clone this reporitory and run the following commands:

```sh
$ npm install
$ npm run tauri build
```

If the build was successful, you should be able to find the application in the `src-tauri/target/release/bundle/` directory.

If you want to use stable Rust instead of nightly Rust, please modify the following line in `src-tauri/Cargo.toml` (performance will be sacrificed):

```diff
[dependencies]
...
- postflop-solver = { git = "https://github.com/b-inary/postflop-solver", features = ["custom-alloc"] }
+ postflop-solver = { git = "https://github.com/b-inary/postflop-solver" }
```

[Rust]: https://www.rust-lang.org/learn/get-started
[Node.js]: https://nodejs.org/en/
[Tauri documentation]: https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-linux

## ~~Roadmap (in order of priority)~~

- Results saving/loading feature ([#8](https://github.com/b-inary/desktop-postflop/issues/8))
- (~1) Hand filter feature for the result viewer ([#6](https://github.com/b-inary/desktop-postflop/issues/6))
- (5) Node-locking feature
- Short deck support
- Aggregated reporting feature for multiple flops
- GTO training mode ([#9](https://github.com/b-inary/desktop-postflop/issues/9))

## License

Copyright (C) 2022 Wataru Inariba

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
