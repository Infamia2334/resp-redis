
// import { Buffer } from 'buffer';

import RespParser from '../src/respParser';

describe('RESP Parser tests', () => {
    const parser = new RespParser();

    it('should deserialize a simple string', () => {
        const buffer = Buffer.from("+OK\r\n");
        const result = parser.deserialize(buffer);
        expect(result).toEqual("OK");
    });

    it('should deserialize a bulk string', () => {
        const buffer = Buffer.from("$6\r\nfoobar\r\n");
        const result = parser.deserialize(buffer);
        expect(result).toEqual("foobar");
    });

    it('should deserialize a null bulk string', () => {
        const buffer = Buffer.from("$-1\r\n");
        const result = parser.deserialize(buffer);
        expect(result).toBeNull();
    });

    it('should deserialize an integer', () => {
        const buffer = Buffer.from(":1000\r\n");
        const result = parser.deserialize(buffer);
        expect(result).toEqual(1000);
    });

    it('should deserialize an array', () => {
        const buffer = Buffer.from("*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n");
        const result = parser.deserialize(buffer);
        expect(result).toEqual(['echo', 'hello world']);
    });

    it('should serialize a simple string', () => {
        expect(parser.serialize('foobar')).toEqual("$6\r\nfoobar\r\n");
        // expect('foobar').toEqual("$6\r\nfoobar\r\n");
        // expect(null).toEqual("$-1\r\n");
        // expect(1000).toEqual(":1000\r\n");
        // expect(['echo', 'hello world']).toEqual("*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n");
    });
});