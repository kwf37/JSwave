import * as P from "parsimmon";
import { Timestep } from "./ast";
import {
    Encoding,
    BitValue,
    Value,
    VCD,
    Variable,
    TimeUnit,
    Scope,
    ScopeType,
    Timescale,
    VCDDate,
    Version,
    VariableType,
    Ref0,
    Ref1,
    Ref2,
    Ref,
} from "./ast";

function token(parser: P.Parser<any>) {
    return parser.skip(P.alt(P.whitespace, P.eof));
}
function word(str: string) {
    return P.string(str).thru(token);
}

const VCDParser = P.createLanguage({
    vcd: r =>
        P.alt(
            r.date.skip(r.comment.sepBy(P.string(""))),
            r.version.skip(r.comment.sepBy(P.string(""))),
            r.timescale.skip(r.comment.sepBy(P.string(""))),
            r.scope_hierarchy.skip(r.comment.sepBy(P.string("")))
        )
            .sepBy(P.string(""))
            .map(arr => {
                const vcd: VCD = {
                    date: null,
                    version: null,
                    timescale: null,
                    toplevel: null,
                    changes: null,
                };
                arr.forEach(decl => {
                    if ((decl as VCDDate).date) {
                        vcd.date = decl;
                    } else if ((decl as Version).version) {
                        vcd.version = decl;
                    } else if ((decl as Timescale).unit) {
                        vcd.timescale = decl;
                    } else if ((decl as Scope).get_id) {
                        vcd.toplevel = decl;
                    }
                });
                return vcd;
            })
            .skip(r.enddefinitions)
            .skip(r.comment.sepBy(P.string("")))
            .chain(vcd => {
                return r.value_changes.map(changes => {
                    vcd.changes = changes;
                    return vcd;
                });
            }),

    // Basic Tokens
    lbracket: () => P.string("[").skip(P.optWhitespace),
    rbracket: () => P.string("]").skip(P.optWhitespace),
    comma: () => P.string(",").skip(P.optWhitespace),
    colon: () => P.string(":").skip(P.optWhitespace),
    hash: () => P.string("#").skip(P.optWhitespace),
    end: () => word("$end"),

    identifier: () => {
        return token(P.regexp(/(\S+)/, 1)).desc("string");
    },
    number: () =>
        P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)
            .skip(P.optWhitespace)
            .map(Number)
            .desc("number"),

    // Declaration keywords

    // Scope type tokens
    begin: () => word("begin").map(_ => ScopeType.Begin),
    fork: () => word("fork").map(_ => ScopeType.Fork),
    function: () => word("function").map(_ => ScopeType.Function),
    module: () => word("module").map(_ => ScopeType.Module),
    task: () => word("task").map(_ => ScopeType.Task),

    // Declaration commands
    // Comments, dates, and versions just return the internal string with no further processing
    comment: () =>
        P.regexp(/\$comment([\S\s]*?)\$end\s+/, 1).map(s => {
            console.log(s);
            return s.trim();
        }),
    date: () =>
        P.regexp(/\$date([\S\s]*?)\$end\s+/, 1).map(s => {
            const date: VCDDate = {
                date: s.trim(),
            };
            return date;
        }),
    enddefinitions: r =>
        word("$enddefinitions")
            .skip(r.end)
            .map(_ => "$enddefinitions"),
    version: () =>
        P.regexp(/\$version([\S\s]*?)\$end\s+/, 1).map(s => {
            const version: Version = {
                version: s.trim(),
            };
            return version;
        }),

    // Scope-related commands
    scope_type: r =>
        r.begin
            .or(r.fork)
            .or(r.function)
            .or(r.module)
            .or(r.task),

    scope: r =>
        word("$scope")
            .then(
                P.seqMap(r.scope_type, r.identifier, (scope_type, id) => {
                    return new Scope(scope_type, id);
                })
            )
            .skip(r.end),

    upscope: r => word("$upscope").skip(r.end),

    scope_hierarchy: r =>
        r.scope
            .chain(scope => {
                return r.scope_hierarchy
                    .or(r.var)
                    .sepBy(P.string(""))
                    .map(arr => {
                        arr.forEach(var_or_scope => {
                            if ((var_or_scope as Variable).size) {
                                scope.add_var(var_or_scope);
                            } else if ((var_or_scope as Scope).get_id()) {
                                scope.add_scope(var_or_scope);
                            }
                        });
                        return scope;
                    });
            })
            .skip(r.upscope),

    // Variable type tokens
    event: () => word("event").map(_ => VariableType.Event),
    integer: () => word("integer").map(_ => VariableType.Integer),
    parameter: () => word("parameter").map(_ => VariableType.Parameter),
    real: () => word("real").map(_ => VariableType.Real),
    reg: () => word("reg").map(_ => VariableType.Reg),
    supply0: () => word("supply0").map(_ => VariableType.Supply0),
    supply1: () => word("supply1").map(_ => VariableType.Supply1),
    time: () => word("time").map(_ => VariableType.Time),
    tri: () => word("tri").map(_ => VariableType.Tri),
    triand: () => word("triand").map(_ => VariableType.Triand),
    trior: () => word("trior").map(_ => VariableType.Trior),
    trireg: () => word("trireg").map(_ => VariableType.Trireg),
    tri0: () => word("tri0").map(_ => VariableType.Tri0),
    tri1: () => word("tri1").map(_ => VariableType.Tri1),
    wand: () => word("wand").map(_ => VariableType.Wand),
    wire: () => word("wire").map(_ => VariableType.Wire),
    wor: () => word("wor").map(_ => VariableType.Wor),

    var_type: r =>
        r.event
            .or(r.integer)
            .or(r.parameter)
            .or(r.real)
            .or(r.reg)
            .or(r.supply0)
            .or(r.supply1)
            .or(r.time)
            .or(r.triand)
            .or(r.trior)
            .or(r.trireg)
            .or(r.tri0)
            .or(r.tri1)
            .or(r.tri)
            .or(r.wand)
            .or(r.wire)
            .or(r.wor),

    ref0: r =>
        r.identifier.map(identifier => {
            const ref: Ref0 = {
                identifier,
            };
            return ref;
        }),
    ref1: r =>
        P.seqMap(
            r.identifier,
            r.lbracket.then(r.number).skip(r.rbracket),
            (identifier, index) => {
                const ref: Ref1 = {
                    identifier,
                    index,
                };
                return ref;
            }
        ),
    ref2: r =>
        P.seqMap(
            r.identifier,
            r.lbracket.then(r.number),
            r.colon.then(r.number).skip(r.rbracket),
            (identifier, msb_index, lsb_index) => {
                const ref: Ref2 = {
                    identifier,
                    msb_index,
                    lsb_index,
                };
                return ref;
            }
        ).chain(ref2 => {
            if (ref2.msb_index < ref2.lsb_index) {
                return P.fail("Msb index cannot be smaller than Lsb index");
            } else {
                return P.succeed(ref2);
            }
        }),

    ref: r => r.ref2.or(r.ref1).or(r.ref0),

    var: r =>
        word("$var")
            .then(
                P.seqMap(
                    r.var_type,
                    r.number,
                    r.identifier,
                    r.ref,
                    (type, size, identifier, ref) => {
                        const variable: Variable = {
                            type,
                            size,
                            identifier,
                            ref,
                        };
                        return variable;
                    }
                )
            )
            .skip(r.end)

            .chain(variable => {
                if (
                    (variable.ref as Ref2).msb_index &&
                    (variable.ref as Ref2).msb_index -
                        (variable.ref as Ref2).lsb_index +
                        1 !==
                        variable.size
                ) {
                    return P.fail(
                        `Variable size and reference do not match up. Variable: ${
                            variable.identifier
                        }, Size: ${variable.size}, Reference: ${JSON.stringify(
                            variable.ref
                        )}`
                    );
                } else if (
                    (variable.ref as Ref1).index &&
                    variable.size !== 1
                ) {
                    return P.fail(
                        `Variable size and reference do not match up. Size should be 1 for single bit reference. Variable: ${
                            variable.identifier
                        }, Size: ${variable.size}, Reference: ${JSON.stringify(
                            variable.ref
                        )}`
                    );
                } else {
                    return P.succeed(variable);
                }
            }),
    // Time unit tokens
    s: () => word("s").map(_ => TimeUnit.s),
    ms: () => word("ms").map(_ => TimeUnit.ms),
    us: () => word("us").map(_ => TimeUnit.us),
    ns: () => word("ns").map(_ => TimeUnit.ns),
    ps: () => word("ps").map(_ => TimeUnit.ps),
    fs: () => word("fs").map(_ => TimeUnit.fs),
    // Parse Timescales
    time_num: r =>
        r.number.chain(n => {
            if (!(n === 1 || n === 10 || n === 100)) {
                return P.fail("Time scale number must be 1, 10, or 100");
            } else {
                return P.succeed(n);
            }
        }),
    time_unit: r =>
        r.s
            .or(r.ms)
            .or(r.us)
            .or(r.ns)
            .or(r.ps)
            .or(r.fs),

    timescale: r =>
        word("$timescale")
            .then(
                P.seqMap(r.time_num, r.time_unit, (n, unit) => {
                    const timescale: Timescale = {
                        num: n,
                        unit,
                    };
                    return timescale;
                })
            )
            .skip(r.end),

    // Simulation keywords- Currently ignores all keywords
    dumpall: () => word("$dumpall"),
    dumpoff: () => word("$dumpoff"),
    dumpon: () => word("$dumpon"),
    dumpvars: () => word("$dumpvars"),

    // Simulation Commands
    // Simulation Timestep
    simulation_time: r => r.hash.then(r.number),

    bit: () =>
        P.regexp(/[01xXzZ]/).map(b => {
            if (b === "0") {
                return Value.Zero;
            } else if (b === "1") {
                return Value.One;
            } else if (b === "x" || b === "X") {
                return Value.X;
            } else if (b === "z" || b === "Z") {
                return Value.Z;
            } else return P.fail("Regexp Failed when parsing bit value");
        }),

    scalar_value: r =>
        P.seqMap(r.bit, r.identifier, (bit, identifier) => {
            const bit_value: BitValue = {
                identifier,
                bit_values: [bit],
                encoding: Encoding.Binary,
            };
            return bit_value;
        }),

    encoding: () =>
        P.regexp(/[bBrR]/).map(enc => {
            if (enc === "b" || enc === "B") {
                return Encoding.Binary;
            } else if (enc === "r" || enc === "R") {
                return Encoding.Binary;
            } else
                return P.fail(
                    "Regexp Failed when parsing vector value encoding"
                );
        }),

    vector_value: r =>
        P.seqMap(
            r.encoding,
            r.bit.sepBy(P.string("")).skip(P.whitespace),
            r.identifier,
            (encoding, bit_values, identifier) => {
                const bit_value: BitValue = {
                    identifier,
                    bit_values,
                    encoding,
                };
                return bit_value;
            }
        ),

    time_step: r =>
        P.seqMap(
            r.simulation_time,
            r.scalar_value.or(r.vector_value).sepBy(P.string("")),
            (time, changes) => {
                const timestep: Timestep = {
                    time,
                    changes,
                };
                return timestep;
            }
        ),

    sim_command: r =>
        P.seqMap(
            r.simulation_time,
            P.alt(r.dumpall, r.dumpon, r.dumpoff, r.dumpvars)
                .then(r.scalar_value.or(r.vector_value).sepBy(P.string("")))
                .skip(r.end),
            (time, changes) => {
                const timestep: Timestep = {
                    time,
                    changes,
                };
                return timestep;
            }
        ),

    value_changes: r => r.sim_command.or(r.time_step).sepBy(P.string("")),
});

export default VCDParser;
