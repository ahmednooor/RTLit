// "RTLit" is a Figma plugin that converts the Arabic/Persian/Urdu text into 
// readable format as Figma currently does not support RTL languages.
// author: ahmed noor (github.com/ahmednooor)
const SPECIAL_CHARS = {
    "\u064B": "",
    "\u064C": "",
    "\u064D": "",
    "\u064E": "",
    "\u064F": "",
    "\u0650": "",
    "\u0651": "",
    "\u0652": "",
    "\u0653": "",
    "\u0654": "",
    "\u0655": "",
    "\u0656": "",
    "\u0657": "",
    "\u0658": "",
};
for (let node of figma.currentPage.selection) {
    if (node.type === 'TEXT') {
        figma.loadFontAsync({ family: node.fontName["family"],
            style: node.fontName["style"] })
            .then((_ => {
            let charStreamArr = node["characters"].split("");
            for (let i = 1; i < charStreamArr.length; i++) {
                if (SPECIAL_CHARS[charStreamArr[i]] !== undefined) {
                    const tempChar = charStreamArr[i - 1];
                    charStreamArr[i - 1] = charStreamArr[i];
                    charStreamArr[i] = tempChar;
                }
            }
            let charStream = charStreamArr.reverse().join("")
                .split("\n").join("");
            if (node["textAutoResize"] === "WIDTH_AND_HEIGHT") {
                node["characters"] = charStream;
            }
            if (node["textAutoResize"] === "WIDTH_AND_HEIGHT"
                && charStream.split("\n").length < 2) {
                return;
            }
            let wordsArr = charStream.split(" ").reverse();
            let linesArr = [];
            let tempNode = node.clone();
            tempNode["characters"] = wordsArr[0];
            tempNode["textAutoResize"] = "HEIGHT";
            let tempNodeInitialHeight = tempNode["height"];
            tempNode["characters"] = "";
            for (const word of wordsArr) {
                let tempCharStream = tempNode["characters"];
                tempNode["characters"] += word + " ";
                if (tempNode["height"] !== tempNodeInitialHeight) {
                    tempCharStream = tempCharStream.split(" ").reverse().join(" ");
                    linesArr.push(tempCharStream);
                    tempNode["characters"] = word + " ";
                }
            }
            linesArr.push(tempNode["characters"].split(" ").reverse().join(" "));
            charStream = linesArr.join(" ");
            charStreamArr = linesArr.join(" ").split("\n");
            if (charStreamArr.length > 1) {
                charStream = charStreamArr.reverse().join("\n");
            }
            node["characters"] = charStream;
            tempNode.remove();
        }));
    }
}
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
