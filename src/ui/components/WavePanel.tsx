import React, { useEffect } from "react";
import * as d3 from "d3";
import {
    Timescale,
    Timestep,
    Variable,
    bitValueString,
} from "../../vcd_utils/ast";

export interface WavePanelProps {
    timescale: Timescale | null;
    changes: Timestep[] | null;
    variables: Variable[];
}

// Helper function that returns a [time, value_string] pair
// Useful for visualization
function getChangesByVar(
    v: Variable,
    changes: Timestep[]
): Array<[number, string]> {
    const arr: Array<[number, string]> = [];
    for (const change of changes) {
        for (const bitValue of change.changes) {
            if (bitValue.identifier === v.identifier) {
                arr.push([change.time, bitValueString(bitValue)]);
            }
        }
    }
    console.log(arr);
    return arr;
}

function timeHelper(changes: Timestep[]) {
    const scalingFactor = 5;
    const finalTime = changes[changes.length - 1].time;
    const svgWidth = finalTime * scalingFactor;

    return [finalTime, svgWidth];
}

function D3Init(div: HTMLDivElement): void {
    const root: d3.Selection<HTMLDivElement, any, HTMLElement, any> = d3.select(
        `#${div.id}`
    );
    // Add SVG
    const svg = root
        .append("svg:svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "black");
    // Add black background
    svg.append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("fill", "black");
}

function D3Update(div: HTMLDivElement, props: WavePanelProps): void {
    // Declare useful constants
    const [finalTime, svgWidth] = timeHelper(props.changes);
    const timeScale = d3
        .scaleLinear()
        .domain([0, finalTime])
        .range([0, svgWidth]);

    const signalHeight = 16;
    const sep = 8;

    // Select toplevel svg component
    const svg: d3.Selection<HTMLDivElement, any, HTMLElement, any> = d3
        .select(`#${div.id}`)
        .select("svg");

    // Update Sizing and background
    svg.attr("width", svgWidth);
    svg.select("rect").attr("width", svgWidth);

    // Update Signal Lines
    const dataSelection = svg.selectAll("g").data(props.variables);
    const groupSelection = dataSelection.enter().append("svg:g");

    groupSelection
        .append("svg:line")
        .attr("x1", 0)
        .attr("x2", _ => timeScale(finalTime))
        .attr("y1", (_, index) => {
            return sep + (signalHeight + sep) * index;
        })
        .attr("y2", (_, index) => {
            return sep + (signalHeight + sep) * index;
        })
        .attr("style", "stroke:rgb(0,255,0);stroke-width:2");

    groupSelection
        .append("svg:line")
        .attr("x1", 0)
        .attr("x2", _ => timeScale(finalTime))
        .attr("y1", (_, index) => {
            return sep + signalHeight + (signalHeight + sep) * index;
        })
        .attr("y2", (_, index) => {
            return sep + signalHeight + (signalHeight + sep) * index;
        })
        .attr("style", "stroke:rgb(0,255,0);stroke-width:2");

    // Add data change annotations
    // const nestedSelection = dataSelection
    //     .selectAll("g")
    //     .data((v, index) => getChangesByVar(v, index, props.changes))
    //     .enter()
    //     .append("svg:g");

    // nestedSelection
    //     .append("svg:line")
    //     .attr("x1", ([time, _, __]) => timeScale(time))
    //     .attr("x2", ([time, _, __]) => timeScale(time))
    //     .attr(
    //         "y1",
    //         ([_, __, varIndex]) => sep + (signalHeight + sep) * varIndex
    //     )
    //     .attr(
    //         "y2",
    //         ([_, __, varIndex]) =>
    //             sep + signalHeight + (signalHeight + sep) * varIndex
    //     )
    //     .attr("style", "stroke:rgb(0,255,0);stroke-width:2");

    // nestedSelection
    //     .append("svg:text")
    //     .attr("x", ([time, _, __]) => timeScale(time))
    //     .attr(
    //         "y",
    //         ([_, __, varIndex]) =>
    //             sep + signalHeight + (signalHeight + sep) * varIndex
    //     )
    //     .text(([_, bitString, i_]) => bitString)
    //     .style("fill", "rgb(0,255,0)");

    svg.selectAll("g")
        .data(props.variables)
        .exit()
        .remove();
}

function useD3Hook(
    props: WavePanelProps,
    data: number[]
): React.RefObject<HTMLDivElement> {
    const [ref, _] = React.useState(React.createRef<HTMLDivElement>());
    const [init, setInit] = React.useState(true);
    useEffect(() => {
        if (init) {
            D3Init(ref.current);
            setInit(false);
        } else if (props.changes !== null && props.timescale !== null) {
            D3Update(ref.current, props);
        }
    });
    return ref;
}

interface SVGProps {
    x1: number; // Left
    x2: number; // Right
    y1: number; // Top
    y2: number; // Bottom
    label: string;
    children?: React.ReactNode;
}

const MultiBitSignalLines: React.FC<SVGProps> = props => {
    return (
        <g>
            <line
                style={{
                    stroke: "rgb(0,255,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y1}
                y2={props.y1}
            />
            <line
                style={{
                    stroke: "rgb(0,255,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y2}
                y2={props.y2}
            />
            {props.children}
        </g>
    );
};

const MultiBitValueChangeSVG: React.FC<SVGProps> = props => {
    return (
        <g>
            <line
                style={{
                    stroke: "rgb(0,0,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y1}
                y2={props.y1}
            />
            <line
                style={{
                    stroke: "rgb(0,0,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y2}
                y2={props.y2}
            />
            <line
                style={{
                    stroke: "rgb(0,255,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y1}
                y2={props.y2}
            />
            <line
                style={{
                    stroke: "rgb(0,255,0)",
                    strokeWidth: 2,
                }}
                x1={props.x1}
                x2={props.x2}
                y1={props.y2}
                y2={props.y1}
            />
            <text
                x={props.x1}
                y={props.y2}
                style={{
                    fill: "rgb(0,255,0)",
                }}
            >
                {props.label}
            </text>
        </g>
    );
};

export const WavePanel: React.FC<WavePanelProps> = props => {
    if (props.changes === null) {
        return (
            <div
                className="button"
                style={{
                    maxWidth: "75vw",
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "auto",
                }}
                id="wavePanel"
            >
                <svg
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <rect
                        style={{
                            width: "100%",
                            height: "100%",
                            fill: "black",
                        }}
                    ></rect>
                </svg>
            </div>
        );
    }
    // const ref = useD3Hook(props, [10, 20, 50]);
    const [finalTime, svgWidth] = timeHelper(props.changes);
    const timeScale = d3
        .scaleLinear()
        .domain([0, finalTime])
        .range([0, svgWidth]);

    const signalHeight = 16;
    const sep = 8;

    return (
        <div
            className="button"
            style={{
                maxWidth: "75vw",
                height: "100%",
                overflowY: "auto",
                overflowX: "auto",
            }}
            id="wavePanel"
        >
            <svg
                style={{
                    width: svgWidth,
                    height: "100%",
                }}
            >
                <rect
                    style={{
                        width: svgWidth,
                        height: "100%",
                        fill: "black",
                    }}
                ></rect>
                {props.variables.map((v, i) => (
                    <MultiBitSignalLines
                        label={""}
                        x1={0}
                        x2={svgWidth}
                        y1={sep + (sep + signalHeight) * i}
                        y2={sep + signalHeight + (sep + signalHeight) * i}
                    >
                        {getChangesByVar(v, props.changes).map(
                            ([time, bitString]) => {
                                return (
                                    <MultiBitValueChangeSVG
                                        x1={timeScale(time) - 2}
                                        x2={timeScale(time) + 2}
                                        y1={sep + (sep + signalHeight) * i}
                                        y2={
                                            sep +
                                            signalHeight +
                                            (sep + signalHeight) * i
                                        }
                                        label={bitString}
                                    ></MultiBitValueChangeSVG>
                                );
                            }
                        )}
                    </MultiBitSignalLines>
                ))}
            </svg>
        </div>
    );
};
