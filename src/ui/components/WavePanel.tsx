import React, { useEffect } from "react";
import * as d3 from "d3";
import { Timescale, Timestep, Variable } from "../../vcd_utils/ast";

export interface WavePanelProps {
    timescale: Timescale | null;
    changes: Timestep[] | null;
    variables: Variable[] | null;
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

function D3Update(
    div: HTMLDivElement,
    data: number[],
    props: WavePanelProps
): void {
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
    const groupSelection = svg
        .selectAll("g")
        .data(data)
        .enter()
        .append("svg:g");

    groupSelection
        .append("svg:line")
        .attr("x1", 0)
        .attr("x2", datum => timeScale(datum))
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
        .attr("x2", datum => timeScale(datum))
        .attr("y1", (_, index) => {
            return sep + signalHeight + (signalHeight + sep) * index;
        })
        .attr("y2", (_, index) => {
            return sep + signalHeight + (signalHeight + sep) * index;
        })
        .attr("style", "stroke:rgb(0,255,0);stroke-width:2");

    svg.selectAll("g")
        .data(data)
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
            D3Update(ref.current, data, props);
        }
    });
    return ref;
}

export const WavePanel: React.FC<WavePanelProps> = (props: WavePanelProps) => {
    const ref = useD3Hook(props, [10, 20, 50]);

    return (
        <div
            className="button"
            style={{
                maxWidth: "75vw",
                height: "100%",
                overflowY: "auto",
                overflowX: "auto",
            }}
            ref={ref}
            id="wavePanel"
        />
    );
};
