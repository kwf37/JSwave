import * as chevrotain from "chevrotain";

const createToken = chevrotain.createToken;

// ========================================
//      Declaration Keyword Definitions
// ========================================
const Comment = createToken({
    name: "Comment",
    pattern: /\$comment/,
});

const Date = createToken({
    name: "Date",
    pattern: /\$date/,
});

const EndDefinitions = createToken({
    name: "EndDefinitions",
    pattern: /\$enddefinitions/,
});

const Scope = createToken({
    name: "Scope",
    pattern: /\$scope/,
});

const TimeScale = createToken({
    name: "TimeScale",
    pattern: /\$timescale/,
});

const UpScope = createToken({
    name: "UpScope",
    pattern: /\$upscope/,
});

const Var = createToken({
    name: "Var",
    pattern: /\$var/,
});

const Version = createToken({
    name: "Version",
    pattern: /\$version/,
});
// ========================================
//        Scope Keyword Definitions
// ========================================
const Begin = createToken({
    name: "Begin",
    pattern: /begin/,
});

const Fork = createToken({
    name: "Fork",
    pattern: /fork/,
});

const Function = createToken({
    name: "Function",
    pattern: /function/,
});

const Module = createToken({
    name: "Module",
    pattern: /module/,
});

const Task = createToken({
    name: "Task",
    pattern: /task/,
});

// ========================================
//      Timescale Keyword Definitions
// ========================================
const TimeNumber = createToken({
    name: "TimeNumber",
    pattern: /1|10|100/,
});

const TimeUnit = createToken({
    name: "TimeUnit",
    pattern: /ms|us|ns|ps|fs|s/,
});
// ========================================
//       Var Type Keyword Definitions
// ========================================
const Event = createToken({
    name: "Event",
    pattern: /event/,
});

const Integer = createToken({
    name: "Integer",
    pattern: /integer/,
});

const Parameter = createToken({
    name: "Parameter",
    pattern: /parameter/,
});

const Real = createToken({
    name: "Real",
    pattern: /real/,
});

const Reg = createToken({
    name: "Reg",
    pattern: /reg/,
});

const Supply0 = createToken({
    name: "Supply0",
    pattern: /supply0/,
});

const Supply1 = createToken({
    name: "Supply1",
    pattern: /supply1/,
});

const Time = createToken({
    name: "Time",
    pattern: /time/,
});

const Tri = createToken({
    name: "Tri",
    pattern: /tri/,
});

const Triand = createToken({
    name: "Triand",
    pattern: /triand/,
});

const Trior = createToken({
    name: "Trior",
    pattern: /trior/,
});

const Trireg = createToken({
    name: "Trireg",
    pattern: /trireg/,
});

const Tri0 = createToken({
    name: "Tri0",
    pattern: /tri0/,
});

const Tri1 = createToken({
    name: "Tri1",
    pattern: /tri1/,
});

const Wand = createToken({
    name: "Wand",
    pattern: /wand/,
});

const Wire = createToken({
    name: "Wire",
    pattern: /wire/,
});

const Wor = createToken({
    name: "Wor",
    pattern: /wor/,
});

// ========================================
//      Simulation Keyword Definitions
// ========================================
const DumpAll = createToken({
    name: "DumpAll",
    pattern: /\$dumpall/,
});

const DumpOff = createToken({
    name: "DumpOff",
    pattern: /\$dumpoff/,
});

const DumpOn = createToken({
    name: "DumpOn",
    pattern: /\$dumpon/,
});

const DumpVars = createToken({
    name: "DumpVars",
    pattern: /\$dumpvars/,
});
// ========================================
//        Miscellaneous Definitions
// ========================================
const WhiteSpace = createToken({
    group: chevrotain.Lexer.SKIPPED,
    name: "WhiteSpace",
    pattern: /\s+/,
});

const Comma = createToken({ name: "Comma", pattern: /,/ });

const Colon = createToken({ name: "Colon", pattern: /:/ });

const Hash = createToken({ name: "Hash", pattern: /#/ });

const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });

const RightBracket = createToken({ name: "RightBracket", pattern: /\]/ });

const End = createToken({
    name: "End",
    pattern: /\$end/,
});

const ScalarValueChange = createToken({
    name: "ScalarValueChange",
    pattern: /[0,1,x,X,z,Z][\x00-\x7F]+/, // Currently just standard ASCII not extended
});

const VectorValue = createToken({
    name: "VectorValueChange",
    pattern: /[b,B,r,R][0,1,x,X,z,Z]+/,
});

const Identifier = createToken({
    name: "Identifier",
    pattern: /[\x00-\x7F]+/,
});

const IntegerNumber = createToken({
    name: "IntegerNumber",
    pattern: /0|[1-9]\d*/,
});

export const allTokens = [
    WhiteSpace,
    End,
    Comma,
    Colon,
    Hash,
    LeftBracket,
    RightBracket,
    Comment,
    Date,
    EndDefinitions,
    Scope,
    TimeScale,
    UpScope,
    Var,
    Version,
    Begin,
    Fork,
    Function,
    Module,
    Task,
    TimeNumber,
    Event,
    Integer,
    Parameter,
    Real,
    Reg,
    Supply0,
    Supply1,
    Time,
    Triand,
    Trior,
    Trireg,
    Tri0,
    Tri1,
    Tri,
    Wand,
    Wire,
    Wor,
    DumpAll,
    DumpOff,
    DumpOn,
    DumpVars,
    ScalarValueChange,
    VectorValue,
    TimeUnit,
    Identifier,
    IntegerNumber,
];

const VCDLexer = new chevrotain.Lexer(allTokens);

export default VCDLexer;
