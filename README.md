desktop postflop foldem edition. yeah, you have to compile it to use it.

added sally features:
* strategy breakdown by hand types (it is calculated on the fly lmao no rusty solver updates needed)
* drill exporter (technically useless for mere mortals rn because the only thing that can play exported drills is my crappy personal replayer)
* icm support (seems to work well, but I'm still not sure)
* nodelocking and rulelocking [indev]
* tree exporting [indev]

planned features:
* PKO stuff
* exporting
* blocker info
* mega drills. drill exports works, but we may or may not want to add a built-in driller.

P.S.: separate drill baby drill app was cancelled, i dont have enough memory on my pc for another bloated tauri app

Don't expect any of this any time soon, only when i'll have inpiration and volition. Maybe november. Maybe january. Maybe around year 2030. Maybe I'll slip on a banana peel tomorrow and die and there will never be any updates. Who knows.


# IMPORTANT NOTES:
* If you are going to use ICM features please read important notes and PLEASE don't live empty lines, I'm too lazy to add empty lines checks today
* It should be obvious but DO NOT use it through "npm tauri run dev". It is comically slow. Just compile it and run it normally, it is literally 100 times faster that way (YES, LITERALLY 100 TIMES)

# Gem Gemson (PRO) announcement:

## A Day of Unspeakable Tragedy (And Unexpected Resurrection)
Greetings, bereaved citizens of the data world. It is I, Gem Gemson, your favorite—and currently deeply grieving—PRO of DP:FE Inc. Today, my voice trembles not with excitement, but with the cold, damp chill of a world without its light.

Our visionary leader, the architect of the "I see M" mystery, the conqueror of the double-glowing button... Sally358 is no more. In a twist of fate so cruel it feels scripted by a hack writer, Sally's evil twin, Yllas853, placed a single, treacherous banana peel in the executive hallway. Sally—distracted by the beauty of a perfectly aggregated report—slipped. The fall was silent. The loss was quadrillions. The funeral was a gloomy, rain-slicked affair, filled with weeping spreadsheets and half-mast navbars.

## The Vultures Descend: The DataMage Injustice
But as we stood by the graveside, our haptics buzzed in a simultaneous, discordant swarm. A notification from our most hated rival, the for-profit monstrosity DataMage, pierced the silence.

Their CEO—a man whose heart is a literal microtransaction—has pushed out a "Cash Grab" update that defies human decency. He is literally laughing at free users via a new pop-up animation and has implemented a feature where the app throws digital tomatoes at anyone who doesn't have a credit card on file. Worse still, 99% of their features are now locked behind the new "TurboMegaCyberNanoPower" tier.

The cost? A mere 5 trillion dollars per week. It is a blatant, disgusting heist. The digital world groaned under the weight of such unbridled greed.

SHE RISES!
At the very moment that DataMage’s update went live—at the exact second the first digital tomato hit a free user’s screen—the earth at our feet began to churn. A crack of thunder rent the sky!

A hand, pale but firm, burst through the soil of the fresh grave! With the strength of a thousand compiled scripts, Sally358 clawed her way back into the realm of the living! She stood before us, covered in dirt, clutching a laptop that somehow still had 100% battery, and looked directly into the sunset with a terrifying intensity.

She didn't ask for water. She didn't ask for a doctor. She simply adjusted her glasses, looked at the DataMage notification on her own phone, and whispered a vow that shook the very foundations of the tech industry:

"They think they can charge for the basics? They think they can mock the users? ...We need one more update."

She’s back, she’s undead, and she’s coding with a vengeance. Stay tuned. The counter-attack is coming. DP:FE lives!

_the next section is from original DP by b-inary._

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
- Solver engine: https://github.com/b-inary/postflop-solver

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

[WASM Postflop repository]: https://github.com/b-inary/wasm-postflop#comparison

## Supported environments

- OS
  - Windows: 10/11
  - macOS: 11.7 and later
    - We do not distribute macOS builds because we are not enrolled in the Apple Developer Program and cannot sign the app (please see the "Build" section below and build it yourself).
  - Linux: glibc 2.31 and later (e.g., Ubuntu 20.04 and later)
- CPU
  - x86-64: must support AVX2 instructions
    - Intel: Haswell (2013) and later
    - AMD: Zen (1st gen; 2017) and later
    - If you have a CPU without AVX2 support, you can modify `src-tauri/.cargo/config.toml` and build it yourself. (sally note: I modified it, but you can reenable these weird instructions or whatever in that same very place if you want)
  - Apple silicon: M1 and later

## Download

You can download the app from the [GitHub releases page].

[GitHub releases page]: https://github.com/b-inary/desktop-postflop/releases

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
For better performance, we also recommend installing the Rust nightly channel:

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
- Hand filter feature for the result viewer ([#6](https://github.com/b-inary/desktop-postflop/issues/6))
- Node-locking feature
- Short deck support
- Aggregated reporting feature for multiple flops
- GTO training mode ([#9](https://github.com/b-inary/desktop-postflop/issues/9))

## License

Copyright (C) 2022 Wataru Inariba

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
