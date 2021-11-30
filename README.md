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
