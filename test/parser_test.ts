import { expect } from "chai";
import VCDParser from "../src/parser";
import { Encoding, TimeUnit, VariableType, ScopeType, Value } from "../src/ast";

describe("Parser", () => {
    describe("Comments", () => {
        it("should ignore the value of comments", () => {
            const parsed = VCDParser.comment.tryParse(
                "$comment Hello I am a comment $end\n"
            );
            expect(parsed).to.equal("Hello I am a comment");
        });
    });
    describe("Date", () => {
        it("should parse on basic Date example", () => {
            const parsed = VCDParser.date.tryParse(
                `\$date June 26, 1989 10:05:41
                 $end\n`
            );
            expect(parsed.date).to.equal("June 26, 1989 10:05:41");
        });
    });
    describe("End Definition", () => {
        it("should return the end definitions keyword", () => {
            const parsed = VCDParser.enddefinitions.tryParse(
                "$enddefinitions $end\n"
            );
            expect(parsed).to.equal("$enddefinitions");
        });
        it("should not have whitespace between enddefinition and end keywords", () => {
            const parsed = VCDParser.enddefinitions.parse(
                "$enddefinitions hi there $end\n"
            );
            expect(parsed.status).to.equal(false);
        });
    });
    describe("Timescale", () => {
        it("should have a number and unit value", () => {
            const parsed = VCDParser.timescale.tryParse(
                "$timescale 10 s $end\n"
            );
            expect(parsed.num).to.equal(10);
            expect(parsed.unit).to.equal(TimeUnit.s);
        });
        it("should support different units", () => {
            const parsed = VCDParser.timescale.tryParse(
                "$timescale 100 ps $end\n"
            );
            expect(parsed.num).to.equal(100);
            expect(parsed.unit).to.equal(TimeUnit.ps);
        });
        it("should fail if the unit is missing", () => {
            const parsed = VCDParser.timescale.parse("$timescale 100  $end\n");
            expect(parsed.status).to.equal(false);
        });
        it("should fail if the value is missing", () => {
            const parsed = VCDParser.timescale.parse("$timescale ps  $end\n");
            expect(parsed.status).to.equal(false);
        });
        it("should fail if the value is not 1, 10, or 100", () => {
            const parsed = VCDParser.timescale.parse("$timescale 42 ps $end\n");
            expect(parsed.status).to.equal(false);
        });
        it("should fail if the timescale is not in units of seconds", () => {
            const parsed = VCDParser.timescale.parse(
                "$timescale 10 min $end\n"
            );
            expect(parsed.status).to.equal(false);
        });
    });
    describe("Variable Reference", () => {
        it("should work with ref0", () => {
            const parsed = VCDParser.ref.tryParse(":]k  \n");
            expect(parsed.identifier).to.equal(":]k");
        });
        it("should work with ref1", () => {
            const parsed = VCDParser.ref.tryParse(":]k [42] \n");
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.index).to.equal(42);
        });
        it("should work with ref1 with spaces", () => {
            const parsed = VCDParser.ref.tryParse(":]k [ 42   ] \n");
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.index).to.equal(42);
        });
        it("should work with ref2", () => {
            const parsed = VCDParser.ref.tryParse(":]k [31:0] \n");
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.msb_index).to.equal(31);
            expect(parsed.lsb_index).to.equal(0);
        });
        it("should work with ref2 with spaces", () => {
            const parsed = VCDParser.ref.tryParse(":]k [  31 : 0 ] \n");
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.msb_index).to.equal(31);
            expect(parsed.lsb_index).to.equal(0);
        });
        it("should fail with ref2 if msb is smaller than lsb", () => {
            const parsed = VCDParser.ref.parse(":]k [0:31] \n");
            expect(parsed.status).to.equal(false);
        });
    });
    describe("Variable", () => {
        it("should parse on a basic example", () => {
            const parsed = VCDParser.var.tryParse(
                "$var wire 32 :]k component $end \n"
            );
            expect(parsed.type).to.equal(VariableType.Wire);
            expect(parsed.size).to.equal(32);
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.ref.identifier).to.equal("component");
        });
        it("should parse on another variable type", () => {
            const parsed = VCDParser.var.tryParse(
                "$var trireg 32 :]k component $end \n"
            );
            expect(parsed.type).to.equal(VariableType.Trireg);
            expect(parsed.size).to.equal(32);
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.ref.identifier).to.equal("component");
        });
        it("should fail on invalid variable type", () => {
            const parsed = VCDParser.var.parse(
                "$var quadreg 32 :]k component $end \n"
            );
            expect(parsed.status).to.equal(false);
        });
        it("should parse on a ref2 type reference", () => {
            const parsed = VCDParser.var.tryParse(
                "$var trireg 32 :]k component [31:0] $end \n"
            );
            expect(parsed.type).to.equal(VariableType.Trireg);
            expect(parsed.size).to.equal(32);
            expect(parsed.identifier).to.equal(":]k");
            expect(parsed.ref.identifier).to.equal("component");
            expect(parsed.ref.msb_index).to.equal(31);
            expect(parsed.ref.lsb_index).to.equal(0);
        });
        it("should fail if size doesn't match ref1", () => {
            const parsed = VCDParser.var.parse(
                "$var quadreg 2 :]k component [3] $end \n"
            );
            expect(parsed.status).to.equal(false);
        });
        it("should fail if size doesn't match ref2", () => {
            const parsed = VCDParser.var.parse(
                "$var quadreg 2 :]k component [3:0] $end \n"
            );
            expect(parsed.status).to.equal(false);
        });
    });
    describe("Scope", () => {
        it("should initialize with an identifier and type", () => {
            const parsed = VCDParser.scope.tryParse("$scope module top $end\n");
            expect(parsed.get_id()).to.equal("top");
            expect(parsed.get_type()).to.equal(ScopeType.Module);
        });
    });
    describe("Scope Hierarchy", () => {
        it("should parse on a basic example with one level of depth", () => {
            const parsed = VCDParser.scope_hierarchy.tryParse(
                `$scope module m1 $end
                $var trireg 1 *@ net1 $end
                $var trireg 1 *# net2 $end
                $var trireg 1 *$ net3 $end
                $upscope $end\n`
            );
            //console.log(parsed);
        });
        it("should parse on a basic example with two levels of depth", () => {
            const parsed = VCDParser.scope_hierarchy.tryParse(
                `$scope module top $end
                $scope module m1 $end
                $var trireg 1 *@ net1 $end
                $var trireg 1 *# net2 $end
                $var trireg 1 *$ net3 $end
                $upscope $end
                $scope task t1 $end
                $var reg 32 (k accumulator[31:0] $end
                $var integer 32 {2 index $end
                $upscope $end
                $upscope $end\n`
            );
            //console.log(parsed);
        });
    });
    describe("VCD declarations", () => {
        it("should parse on a basic example", () => {
            const parsed = VCDParser.vcd.tryParse(
                `$date June 26, 1989 10:05:41
                $end
                $version VERILOG-SIMULATOR 1.0a
                $end
                $timescale 1 ns
                $end
                $scope module top $end
                $scope module m1 $end
                $var trireg 1 *@ net1 $end
                $var trireg 1 *# net2 $end
                $var trireg 1 *$ net3 $end
                $upscope $end
                $scope task t1 $end
                $var reg 32 (k accumulator[31:0] $end
                $var integer 32 {2 index $end
                $upscope $end
                $upscope $end
                $enddefinitions $end\n`
            );
            //console.log(parsed);
        });
    });
    describe("Simulation Time", () => {
        it("should parse with space after #", () => {
            const parsed = VCDParser.simulation_time.tryParse("# 42");
            expect(parsed).to.equal(42);
        });
        it("should parse with no space after #", () => {
            const parsed = VCDParser.simulation_time.tryParse("#42");
            expect(parsed).to.equal(42);
        });
        it("should parse with whitespace after number", () => {
            const parsed = VCDParser.simulation_time.tryParse("#42  \n");
            expect(parsed).to.equal(42);
        });
    });
    describe("Value parsing", () => {
        it("should parse a scalar value with value 1", () => {
            const parsed = VCDParser.scalar_value.tryParse("1;] \n");
            expect(parsed.identifier).to.equal(";]");
            expect(parsed.bit_values).to.eql([Value.One]);
        });
        it("should parse a scalar value with value z", () => {
            const parsed = VCDParser.scalar_value.tryParse("Z;] \n");
            expect(parsed.identifier).to.equal(";]");
            expect(parsed.bit_values).to.eql([Value.Z]);
        });
        it("should parse a scalar value with value z, regardless of case", () => {
            const parsed = VCDParser.scalar_value.tryParse("z;] \n");
            expect(parsed.identifier).to.equal(";]");
            expect(parsed.bit_values).to.eql([Value.Z]);
        });
        it("should not parse a scalar value with space after the value", () => {
            const parsed = VCDParser.scalar_value.parse("1 ;] \n");
            expect(parsed.status).to.equal(false);
        });
        it("should parse a vector value with space after the value", () => {
            const parsed = VCDParser.vector_value.tryParse("b10xXzZ ;] \n");
            expect(parsed).to.eql({
                identifier: ";]",
                encoding: Encoding.Binary,
                bit_values: [
                    Value.One,
                    Value.Zero,
                    Value.X,
                    Value.X,
                    Value.Z,
                    Value.Z,
                ],
            });
        });
        it("should not parse a vector value with no space after the value", () => {
            const parsed = VCDParser.vector_value.parse("b10xXzZ;] \n");
            expect(parsed.status).to.equal(false);
        });
    });
    describe("Multiple Value Changes", () => {
        it("should support multiple timesteps with no simulation keywords", () => {
            const parsed = VCDParser.value_changes.tryParse(
                `#500
                x*@
                x*#
                x*$
                bx (k
                bx {2
                #505
                0*@
                1*#
                1*$
                b10z (k
                b111 {2
                #510
                0*$
            `
            );
            expect(parsed[0].time).to.equal(500);
            expect(parsed[1].time).to.equal(505);
            expect(parsed[2].time).to.equal(510);
        });
        it("should ignore simulation keywords", () => {
            const parsed = VCDParser.value_changes.tryParse(
                `#500
                $dumpvars
                x*@
                x*#
                x*$
                bx (k
                bx {2
                $end
                #505
                0*@
                1*#
                1*$
                b10z (k
                b111 {2
                #510
                0*$
            `
            );
            expect(parsed[0].time).to.equal(500);
            expect(parsed[1].time).to.equal(505);
            expect(parsed[2].time).to.equal(510);
        });
        it("should support empty timesteps", () => {
            const parsed = VCDParser.value_changes.tryParse(``);
            expect(parsed).to.eql([]);
        });
    });
    describe("Toplevel Parser", () => {
        it("should handle the example from the Verilog 2001 standard", () => {
            const parsed = VCDParser.vcd.tryParse(`$date June 26, 1989 10:05:41
            $end
            $version VERILOG-SIMULATOR 1.0a
            $end
            $timescale 1 ns
            $end
            $scope module top $end
            $scope module m1 $end
            $var trireg 1 *@ net1 $end
            $var trireg 1 *# net2 $end
            $var trireg 1 *$ net3 $end
            $upscope $end
            $scope task t1 $end
            $var reg 32 (k accumulator[31:0] $end
            $var integer 32 {2 index $end
            $upscope $end
            $upscope $end
            $enddefinitions $end
            $comment
            Note: $dumpvars was executed at time '#500'.
            All initial values are dumped at this time.
            $end
            #500
            $dumpvars
            x*@
            x*#
            x*$
            bx (k
            bx {2
            $end
            #505
            0*@
            1*#
            1*$
            b10zx1110x11100 (k
            b1111000101z01x {2
            #510
            0*$
            #520
            1*$
            #530
            0*$
            bz (k
            #535
            $dumpall 0*@ 1*# 0*$
            bz (k
            b1111000101z01x {2
            $end
            #540
            1*$
            #1000
            $dumpoff
            x*@
            x*#
            x*$
            bx (k
            bx {2
            $end
            #2000
            $dumpon
            z*@
            1*#
            0*$
            b0 (k
            bx {2
            $end
            #2010
            1*$\n`);
            console.log(parsed);
        });
    });
});
