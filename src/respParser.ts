type RESPValue = string | number | null | RESPValue[];
export default class RespParser {
    // constructor() {

    // }

    serialize(data: string | string[] | number | null) {
        if (data === null) {
            return `$-1\r\n`;
        }
        if (typeof data === 'number') {
            return `:${data}\r\n`;
        }
        if (typeof data === 'string') {
            return `$${data.length}\r\n${data}\r\n`;
        }
        if (Array.isArray(data)) {
            let serializedArr = `${data.length}\r\n`;
            for (const element of data) {
                serializedArr += this.serialize(element);
            }

            return serializedArr;
        }
    }

    deserialize(buffer: Buffer): RESPValue {
        const stringifiedBuffer = buffer.toString();

        console.log(stringifiedBuffer);

        switch(stringifiedBuffer[0]) {
            case '-':
                return stringifiedBuffer.slice(1, -2);
            
            case '+':
                return stringifiedBuffer.slice(1, -2);

            case ':':
                return parseInt(stringifiedBuffer.slice(1, -2));

            case '$':
                const seperatorIndex = buffer.indexOf('\r\n')
                const length = parseInt(stringifiedBuffer.slice(1, seperatorIndex));

                if (length === -1) {
                    return null;  // Null Bulk String
                }
    
                const valueStart = seperatorIndex + 2;
                const valueEnd = valueStart + length;
                return stringifiedBuffer.slice(valueStart, valueEnd);

            case '*':  // Arrays
                const arraySeparatorIndex = stringifiedBuffer.indexOf('\r\n');
                const numElements = parseInt(stringifiedBuffer.slice(1, arraySeparatorIndex));  // Number of elements after '*'
            
                const elements = [];
                let currentIndex = arraySeparatorIndex + 2;  // Start after '*<numElements>\r\n'
            
                for (let i = 0; i < numElements; i++) {
                    const elementSeparatorIndex = stringifiedBuffer.indexOf('\r\n', currentIndex);
                    const elementLength = parseInt(stringifiedBuffer.slice(currentIndex + 1, elementSeparatorIndex)); // Length of the current element
                    
                    // Handle null bulk strings
                    if (elementLength === -1) {
                        elements.push(null);
                        currentIndex = elementSeparatorIndex + 2; // Move past the '$-1\r\n'
                        continue;
                    }
            
                    // Now slice the buffer to get the actual element
                    const element = stringifiedBuffer.slice(elementSeparatorIndex + 2, elementSeparatorIndex + 2 + elementLength).toString();
                    elements.push(element);
            
                    // Update the currentIndex to the end of this element
                    currentIndex = elementSeparatorIndex + 2 + elementLength + 2; // Move past the element and the trailing '\r\n'
                }
                return elements;
        }

        throw new Error('Invalid RESP type')
    }
}