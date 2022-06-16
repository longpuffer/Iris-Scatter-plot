import * as d3 from "d3";
import { useEffect, useState } from "react";
import "bulma/css/bulma.css";

export default function App() {
  const [data, setData] = useState(null);
  const [xValue, setXValue] = useState("sepalLength");
  const [yValue, setYValue] = useState("sepalWidth");
  const [setora, setSetora] = useState(1);
  const [versicolor, setVersicolor] = useState(1);
  const [virginica, setVirginica] = useState(1);
  const stateSpecie = [setora, versicolor, virginica];
  const setSpecie = [setSetora, setVersicolor, setVirginica];

  useEffect(() => {
    const res = fetch("https://assets.codepen.io/2004014/iris.json")
      .then((res) => res.json())
      .then((x) => {
        setData(x);
      });
  }, []);

  if (data == null) {
    return <div>loading</div>;
  } else {
    const keys = [];
    Object.keys(data[0]).map((x) => {
      if (!isNaN(data[0][x]) && data[0][x] != 1) {
        keys.push(x);
      }
    });

    let specie = data.map((x) => x.species);
    specie = [...new Set(specie)];

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    for (const i of data) {
      i.color = color(i.species);
      for (let j = 0; j < specie.length; j++) {
        if (specie[j] == i.species) {
          i.show = stateSpecie[j];
          i.set = setSpecie[j];
        }
      }
    }

    const xScale = d3
      .scaleLinear()
      .domain([
        Math.min(...data.map((x) => x[xValue])),
        Math.max(...data.map((x) => x[xValue])),
      ])
      .range([50, 800 - 50])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(...data.map((y) => y[yValue])),
        Math.max(...data.map((y) => y[yValue])),
      ])
      .range([50, 800 - 50])
      .nice();
    const xCali = xScale.ticks();
    const yCali = yScale.ticks();

    return (
      <div>
        <div className="container">
          <div className="clumns">
            <div className="clumn">
              <p className="subtitle is-4">x propaty</p>
            </div>
            <div className="clumn">
              <div className="select is-fullwidth">
                <select
                  value={data.datum}
                  onChange={(e) => {
                    setXValue(e.target.value);
                  }}
                >
                  {keys.map((x) => {
                    return (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="clumns">
            <div className="clumn">
              <p className="subtitle is-4">y propaty</p>
            </div>
            <div className="clumn">
              <div className="select is-fullwidth">
                <select
                  value={data.datum}
                  onChange={(e) => {
                    setYValue(e.target.value);
                  }}
                >
                  {keys.map((x) => {
                    return (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="container is-max-widescreen">
            <svg width="800" height="800">
              {data.map((x, index) => {
                return (
                  <g key={index}>
                    <circle
                      transform={`translate(${xScale(x[xValue])},${
                        800 - yScale(x[yValue])
                      })`}
                      opacity={x.show}
                      r="5"
                      fill={x.color}
                      style={{ transition: "transform 0.5s , opacity 0.5s" }}
                    ></circle>
                  </g>
                );
              })}
              <g key="">
                <line x1="50" x2="50" y1="50" y2="750" stroke="black"></line>
                {yCali.map((x) => {
                  return (
                    <g
                      key={x}
                      transform={`translate(50,${800 - yScale(x)})`}
                      stroke="black"
                    >
                      <text
                        alignmentBaseline="center"
                        textAnchor="middle"
                        x="-30"
                        y="5"
                      >
                        {x}
                      </text>
                      <line x1="0" x2="-10" y1="0" y2="0"></line>
                    </g>
                  );
                })}
                <line x1="50" x2="750" y1="750" y2="750" stroke="black"></line>
                {xCali.map((x) => {
                  return (
                    <g
                      key={x}
                      transform={`translate(${xScale(x)},750)`}
                      stroke="black"
                    >
                      <text
                        alignmentBaseline="center"
                        textAnchor="middle"
                        x="0"
                        y="20"
                      >
                        {x}
                      </text>
                      <line x1="0" x2="0" y1="0" y2="10"></line>
                    </g>
                  );
                })}
              </g>
              {specie.map((x, index) => {
                return (
                  <g
                    key={x}
                    transform={`translate(700,${(40, (index + 1) * 30)})`}
                    opacity={stateSpecie[index] * 0.5 + 0.5}
                    style={{ transition: "opacity 0.5s" }}
                    onClick={() => {
                      for (const i of data) {
                        for (let j = 0; j < specie.length; j++) {
                          if (specie[j] == x) {
                            setSpecie[j](Math.abs(stateSpecie[j] - 1));
                          }
                        }
                      }
                    }}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      fill={color(x)}
                    ></rect>
                    <text
                      alignmentBaseline="middle"
                      textAnchor="MiddleLeft"
                      x="20"
                      y="10"
                    >
                      {x}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
