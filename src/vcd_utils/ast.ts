export interface VCD {
    date: VCDDate | null;
    version: Version | null;
    toplevel: Scope | null;
    timescale: Timescale | null;
    changes: Timestep[] | null;
}

export interface VCDDate {
    date: string;
}

export interface Version {
    version: string;
}

export interface Timestep {
    time: number;
    changes: BitValue[];
}
// ========================================
//          Scope Type Definitions
// ========================================
export class Scope {
    private type: ScopeType;
    private identifier: string;
    private variables: Variable[];
    private sub_scopes: Scope[];

    constructor(type: ScopeType, identifier: string) {
        this.type = type;
        this.identifier = identifier;
        this.variables = [];
        this.sub_scopes = [];
    }
    public add_var(v: Variable) {
        this.variables.push(v);
    }
    public add_scope(s: Scope) {
        this.sub_scopes.push(s);
    }
    public get_id() {
        return this.identifier;
    }
    public get_type() {
        return this.type;
    }
    public get_subscopes() {
        return this.sub_scopes;
    }
    public get_vars() {
        return this.variables;
    }
}

export enum ScopeType {
    Begin = "begin",
    Fork = "fork",
    Function = "function",
    Module = "module",
    Task = "task",
}

// ========================================
//      Variable Declaration Type Definitions
// ========================================

export enum VariableType {
    Event = "event",
    Integer = "integer",
    Parameter = "parameter",
    Real = "real",
    Reg = "reg",
    Supply0 = "supply0",
    Supply1 = "supply1",
    Time = "time",
    Tri = "tri",
    Triand = "triand",
    Trior = "trior",
    Trireg = "trireg",
    Tri0 = "tri0",
    Tri1 = "tri1",
    Wand = "wand",
    Wire = "wire",
    Wor = "wor",
}

export interface Ref0 {
    identifier: string;
}

export interface Ref1 {
    identifier: string;
    index: number;
}
export interface Ref2 {
    identifier: string;
    msb_index: number;
    lsb_index: number;
}

export type Ref = Ref0 | Ref1 | Ref2;

export interface Variable {
    type: VariableType;
    size: number;
    identifier: string;
    ref: Ref;
}

export interface Timescale {
    num: number;
    unit: TimeUnit;
}

export enum TimeUnit {
    s = "s",
    ms = "ms",
    us = "us",
    ns = "ns",
    ps = "ps",
    fs = "fs",
}
// ========================================
//      Simulation Type Definitions
// ========================================
export enum Value {
    One = "1",
    Zero = "0",
    X = "x",
    Z = "z",
}

export interface BitValue {
    identifier: string;
    bit_values: Array<Value>;
    encoding: Encoding;
}

export enum Encoding {
    Binary = "b",
    Real = "r",
}
