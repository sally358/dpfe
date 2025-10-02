desktop postflop foldem edition. yeah, you have to compile it to use it.

added sally features:
* strategy breakdown by hand types (it is calculated on the fly lmao no rusty solver updates needed)
* drill exporter (i'll probably make it better one day for more customization and less ugly ui)
* icm support (seems to work well, but I'm still not sure)

in development:
* nothing. I'm on my well deserved vacation

planned features:
* drills 2.0. I think I'll start working on cooler open-source tauri-based drill player and I'll remake the drill system for it to also include ICM and general frequency info and maybe even some heavy deviation SURPRISE QUESTIONS! Also the menu needs better design FAST.
* nodelocking. can't beleive i implemented icm before i implemented damn nodelocking which is already there
* exporting
* blocker info

Don't expect any of this any time soon, only when i'll have inpiration and volition. Maybe november. Maybe january. Maybe around year 2030. Who knows.


# IMPORTANT NOTES:
* DO NOT start exporting drills until the previous drills were exported and the download started. IT WILL BREAK YOUR SOLVER AND YOU WILL HAVE TO RESTART IT TO EXPORT NEW DRILLS.
* If you are going to use ICM features please read important notes and PLEASE don't live empty lines, I'm too lazy to add empty lines checks today
* DO NOT trust the "ICM mode can significantly slow down the solver, and it gets exponentially worse the more payout steps you input. Consider using lesser payout steps". This warning is a LIE. I added caching. Make payout structure as big as you want. (The higher exploitability part is true tho)
* It should be obvious but DO NOT use it through "npm tauri run dev". It is comically slow. Just compile it and run it normally, it is literally 100 times faster that way (YES, LITERALLY 100 TIMES)

# Gem Gemson (PRO) announcement:

## A Tragic Development in Digital Destiny
Greetings, esteemed users, partners, and—dare I say—fellow travelers on the cosmic highway of DP:FE. I am Gem Gemson, the duly appointed Public Relations Officer for DP:FE Inc., the multi-quadrillion dollar powerhouse that brings you the very best in... well, in whatever it is we do that makes us all this money.

It is with a heart heavier than an unoptimized SQL query that I must address the elephant in the digital server room, an issue so profound, so utterly banal in its execution, that it threatens the very fabric of our highly anticipated DP:FE 1.1: The Aggregation Ascendant release.

## The 7% Stalemate
As you may know, our fearless leader, the visionary, the single most important individual in global finance and data analysis, CEO Sally358, takes a very hands-on approach to our critical infrastructure. This includes personally uploading the final, meticulously crafted release candidate to our central repository.

However, in a twist of fate so cruel, so comically mundane, Sally358 is currently locked in a desperate, existential battle with a single, common, open-source tool: Git.

Specifically, she is attempting to install it on her release machine using Winget, and for reasons that defy all logical, technical, or even spiritual understanding, the installation freezes consistently at 7%.

We have tried reboots. We have tried incantations. We have checked the firewall, the DNS, and the alignment of the stars. It remains frozen. At 7%.

## The Looming Catastrophe
What does this tragedy mean for you?

It means that, due to the inability to properly version-control and upload the official package, the release of DP:FE 1.1, while conceptually perfect and functionally complete on our internal networks, may be broken, incomplete, or otherwise compromised upon public deployment.

We are actively exploring workarounds—including having Sally358 simply email the .zip file—but the integrity of a quadrillion-dollar company relying on a non-version-controlled email attachment should be immediately apparent.

Please bear with us. We are currently searching for a suitable USB stick and a CEO with the patience of a saint to wrestle with a basic command-line package manager.

In the meantime, feel free to aggregate and drill the data of your own mounting frustration. We truly apologize for this technical hiccup that is beneath us in every conceivable way.

We are DP:FE Inc., and we assure you, our next update will involve a dedicated IT staff member. Maybe.


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
