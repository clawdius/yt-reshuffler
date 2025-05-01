<p align="center">
<img src="https://github.com/user-attachments/assets/fc10922d-46e8-4b37-923c-b8894c249d90" width="64" height="64">
</p>
<h1 align="center">YT-Reshuffler</h1>

![image](https://github.com/user-attachments/assets/91fb7323-e844-49b9-848e-9d1f483dae80)
<p align=center> <i>Image does not represent final quality, because it's still Work In Progress, after all </i></p>

## # Why?
Youtube default playlist shuffler sucks, my playlist has 1000+ songs and the shuffler died before shuffling my entire playlist, so I made those online "Youtube Randomizer" thing for desktop, powered by [Electron](https://www.electronjs.org/) type shii 🔥🔥.

Heavily inspired <sup><sub>(probably the only reason, to be honest)</sub></sup> by [Youtube Playlist Randomizer](https://youtube-playlist-randomizer.bitbucket.io/), big thanks to whoever made that masterpiece.

## # (Not so) Frequently Asked Questions
### > Why Electron?
I don't want to open my chrome with a gazillion extensions just to listen to [Didn't See That Coming](https://music.youtube.com/watch?v=t7zWExFJL5I) by Quinten Coblentz.
Besides, I just want to learn Electron. **You learn new technology by making something with it, right?**

### > Using Json to save things in the big 25? There's this technology called `database`, my guy. 🥀🥀
No thanks, using portable DB such as `sqlite` is overrated.

### > Why the heck do I need Express? I thought this is a "client-only" app?
Youtube's embed gets mad if we directly use it with `file:///` protocol.
Default Electron's way to open / load a file (as far as I know) is directly call the file via `file:///` protocol or `loadURL()`.
Express is here just to serve static files, so it will use `loadURL()` and use the `localhost` protocol, thus the Youtube's embed will stop whining. Nothing fancy handy magic thing going on here.

### > The UI sucks, the icons are disproportionate, learn how to do UI/UX!
This isn't even a question. I love to make sure the program run first, then beautify it, not the other way around.

### > When will you build the app into a final product?
I aim to make the basic player utility (player control, multiple playlist support, etc.) to be ready first.

### > Can I use your Youtube API key?
No.

## # Disclaimer
This application is an independent project and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Google LLC, YouTube, or any of their subsidiaries or affiliates. All trademarks, logos, and brand names are the property of their respective owners. The use of YouTube’s name and services is solely for descriptive purposes and does not imply any endorsement.
<sup><sub>*Thanks ChatGPT for the disclaimer template*</sub></sup>
