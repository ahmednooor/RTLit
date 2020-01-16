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
const LTR_CHARS = "" +
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    ".,1234567890/*-+_=\\!@#$%^&*;?`~ ";
function isPersoArabicLTRChar(char) {
    // tells you if its numeric etc. since numbers are LTR in arabic
    return ((char.codePointAt(0) > 1775 && char.codePointAt(0) < 1786)
        || (char.codePointAt(0) > 1631 && char.codePointAt(0) < 1646));
}
for (let node of figma.currentPage.selection) {
    if (node.type === 'TEXT') {
        figma.loadFontAsync({ family: node.fontName["family"],
            style: node.fontName["style"] })
            .then((_ => {
            let finalStream = [];
            // console.log(node["characters"].length);
            for (let charStream of node["characters"].split("\n")) {
                let charStreamArr = charStream.split("");
                for (let i = 1; i < charStreamArr.length; i++) {
                    if (SPECIAL_CHARS[charStreamArr[i]] !== undefined) {
                        const tempChar = charStreamArr[i - 1];
                        charStreamArr[i - 1] = charStreamArr[i];
                        charStreamArr[i] = tempChar;
                    }
                }
                charStream = "";
                let LTRCharIndices = [];
                for (let i = 0; i < charStreamArr.length; i++) {
                    if (LTR_CHARS.includes(charStreamArr[i])
                        || isPersoArabicLTRChar(charStreamArr[i])) {
                        LTRCharIndices.push(i);
                        continue;
                    }
                    if (LTRCharIndices.length > 0) {
                        charStream += charStreamArr.slice(LTRCharIndices[0], i)
                            .reverse().join("");
                        LTRCharIndices = [];
                    }
                    charStream += charStreamArr[i];
                }
                if (LTRCharIndices.length > 0) {
                    charStream += charStreamArr
                        .slice(LTRCharIndices[0], LTRCharIndices[LTRCharIndices.length])
                        .reverse().join("");
                    LTRCharIndices = [];
                }
                charStream = charStream.split("").reverse().join("");
                let wordsArr = charStream.split(" ");
                charStream = wordsArr.join(" ");
                if (node["textAutoResize"] === "WIDTH_AND_HEIGHT") {
                    finalStream.push(charStream);
                    continue;
                }
                wordsArr = wordsArr.reverse();
                let tempNode = node.clone();
                tempNode["characters"] = wordsArr[0];
                tempNode["textAutoResize"] = "HEIGHT";
                let tempNodeInitialHeight = tempNode["height"];
                let linesArr = [];
                tempNode["characters"] = "";
                for (const word of wordsArr) {
                    let tempCharStream = tempNode["characters"];
                    tempNode["characters"] += word;
                    if (tempNode["height"] !== tempNodeInitialHeight) {
                        /* uncommenting below statement makes the total bef/aft input str
                        len same but messes up formating */
                        // tempCharStream = tempCharStream.substr(
                        //   0, tempCharStream.length - 1);
                        tempCharStream = tempCharStream.split(" ").reverse().join(" ");
                        linesArr.push(tempCharStream);
                        tempNode["characters"] = word;
                    }
                    tempNode["characters"] += " ";
                }
                tempNode["characters"] = tempNode["characters"].substr(0, tempNode["characters"].length - 1);
                linesArr.push(tempNode["characters"].split(" ").reverse().join(" "));
                charStream = linesArr.join(" ");
                finalStream.push(charStream);
                tempNode.remove();
            }
            node["characters"] = finalStream.join("\n");
            // console.log(node["characters"].length);
        }));
    }
}
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
