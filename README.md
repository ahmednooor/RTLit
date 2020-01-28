# RTLit

"RTLit" is a Figma plugin that converts the Arabic/Persian/Urdu text into readable format as Figma currently does not support RTL languages.

Behind the scenes it reverses the characters and does some other things to turn RTL gobbledigook into readable text. It has its limitations (see Known Issues below).

## How To

1. Copy Arabic/Persian/Urdu text from the source i.e. a web browser or other design software such as Adobe Illustrator etc.
2. Paste it into the Figma Text Box. Make sure you have selected a font that supports Perso-Arabic letters.
3. Select Figma Text Box (You can select more than one at a time as well).
4. `Right Click > Plugins > RTLit`
5. Done.

> Make sure you retain the original text somewhere. If you transform the Figma Text Box, you will have to redo the steps mentioned above.

## Known Issues

1. LTR words such as numbers or english text if broken in two lines might create problems in formatting.
2. There might be more unknown issues feel free to report them here (https://github.com/ahmednooor/RTLit/issues). Behind the scenes, it reverses the characters sort of like it is mentioned here (https://help.figma.com/article/70-writing-in-other-languages) in "Use Right-To-Left (RTL) languages" section on forums.


------

## Default Readme Template (For Development)

This plugin template uses Typescript. If you are familiar with Javascript, Typescript will
look very familiar. In fact, valid Javascript code is already valid Typescript code.

Typescript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using Typescript requires a compiler to convert Typescript (code.ts) into Javascript (code.js)
for the browser to run.

To get the TypeScript compiler working:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Install the TypeScript compiler globally: `sudo npm install -g typescript`.
3. Open this directory in Visual Studio Code.
4. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "tsc: watch - tsconfig.json". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
