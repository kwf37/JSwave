import { expect } from "chai";
import {
    Encoding,
    Value,
    BitValue,
    bitValueString,
} from "../src/vcd_utils/ast";

describe("AST Helper Functions", () => {
    describe("Bit Strings", () => {
        it("should work for basic strings", () => {
            const bitValue: BitValue = {
                identifier: "test",
                bit_values: [Value.One, Value.Zero, Value.X, Value.Z],
                encoding: Encoding.Binary,
            };
            expect(bitValueString(bitValue)).to.equal("b10xz");
        });
    });
});
