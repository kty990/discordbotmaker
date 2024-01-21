class CodeBox {
    constructor(HTMLElement = null, lineNumbers = true, tabSpacing = 4) {
        this.element = HTMLElement;
        this.lineNumbers = lineNumbers;
        this.spacing = tabSpacing;
    }

    format() {
        let tmp = this.element.value.replace("\n", "").replace("\t", "").replace(" ", "");
        let result = [];
        let indent = 0;
        let line = 1;
        for (const char of tmp) {
            result.push({ indent: indent, value: char, line: line });
            if (char == "{") {
                index++;
            }
            if (char == "\n") {
                line++;
            }
        }
    }
}

module.exports = { CodeBox };