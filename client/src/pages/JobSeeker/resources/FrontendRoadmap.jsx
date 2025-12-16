import React from "react";
import ReactFlow, { Controls } from "react-flow-renderer";

const FrontedRoadmap = () => {
  const nodes = [
    {
      id: "1",
      type: "default",
      position: { x: 500, y: 0 },
      data: { label: "Frontend Development" },
    },
    {
      id: "2",
      type: "default",
      position: { x: 400, y: 100 },
      data: { label: "HTML" },
    },
    {
      id: "3",
      type: "default",
      position: { x: 600, y: 100 },
      data: { label: "CSS" },
    },
    {
      id: "4",
      type: "default",
      position: { x: 500, y: 250 },
      data: { label: "JavaScript" },
    },
    {
      id: "5",
      type: "default",
      position: { x: 200, y: 100 },
      data: { label: "Basics of HTML" },
    },
    {
      id: "6",
      type: "default",
      position: { x: 200, y: 160 },
      data: { label: "Semantic HTML" },
    },
    {
      id: "7",
      type: "default",
      position: { x: 200, y: 210 },
      data: { label: "Forms & Validations" },
    },
    {
      id: "8",
      type: "default",
      position: { x: 200, y: 260 },
      data: { label: "SEO Basics" },
    },
    {
      id: "9",
      type: "default",
      position: { x: 800, y: 100 },
      data: { label: "Basics of CSS" },
    },
    {
      id: "10",
      type: "default",
      position: { x: 800, y: 150 },
      data: { label: "Making Layouts" },
    },
    {
      id: "11",
      type: "default",
      position: { x: 800, y: 200 },
      data: { label: "Responsive Design" },
    },
    {
      id: "12",
      type: "default",
      position: { x: 360, y: 320 },
      data: { label: "Basics of JS" },
    },
    {
      id: "13",
      type: "default",
      position: { x: 360, y: 370 },
      data: { label: "DOM Manipulation" },
    },
    {
      id: "14",
      type: "default",
      position: { x: 360, y: 420 },
      data: { label: "Fetch API" },
    },
    {
      id: "15",
      type: "default",
      position: { x: 700, y: 320 },
      data: { label: "Version Control" },
    },
    {
      id: "16",
      type: "default",
      position: { x: 900, y: 320 },
      data: { label: "Git" },
    },

    {
      id: "18",
      type: "default",
      position: { x: 700, y: 450 },
      data: { label: "VCS Hosting" },
    },
    {
      id: "19",
      type: "default",
      position: { x: 600, y: 600 },
      data: { label: "Package Manager" },
    },
    {
      id: "20",
      type: "default",
      position: { x: 400, y: 520 },
      data: { label: "npm" },
    },
    {
      id: "21",
      type: "default",
      position: { x: 400, y: 600 },
      data: { label: "pnpm" },
    },
    {
      id: "22",
      type: "default",
      position: { x: 400, y: 680 },
      data: { label: "yarn" },
    },
    {
      id: "23",
      type: "default",
      position: { x: 1200, y: 450 },
      data: { label: "GitHub" },
    },
    {
      id: "24",
      type: "default",
      position: { x: 1050, y: 450 },
      data: { label: "GitLab" },
    },
    {
      id: "25",
      type: "default",
      position: { x: 900, y: 450 },
      data: { label: "BitBucket" },
    },
    {
      id: "26",
      type: "default",
      position: { x: 600, y: 720 },
      data: { label: "Pick a Framework" },
    },
    {
      id: "27",
      type: "default",
      position: { x: 800, y: 720 },
      data: { label: "Writing CSS" },
    },
    {
      id: "28",
      type: "default",
      position: { x: 1000, y: 720 },
      data: { label: "Tailwind" },
    },
    {
      id: "29",
      type: "default",
      position: { x: 400, y: 850 },
      data: { label: "ReactJS" },
    },
    {
      id: "30",
      type: "default",
      position: { x: 550, y: 850 },
      data: { label: "Vue.js" },
    },
    {
      id: "31",
      type: "default",
      position: { x: 700, y: 850 },
      data: { label: "Angular" },
    },
    {
      id: "32",
      type: "default",
      position: { x: 850, y: 850 },
      data: { label: "Svelte" },
    },
    {
      id: "33",
      type: "default",
      position: { x: 1000, y: 850 },
      data: { label: "Solid.js" },
    },
    {
      id: "34",
      type: "default",
      position: { x: 1150, y: 850 },
      data: { label: "Qwik" },
    },
  ];

  const edges = [
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
    { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
    { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
    { id: "e3-4", source: "3", target: "4", type: "smoothstep" },
    { id: "e2-5", source: "2", target: "5", type: "smoothstep" },
    { id: "e5-6", source: "5", target: "6", type: "smoothstep" },
    { id: "e6-7", source: "6", target: "7", type: "smoothstep" },
    { id: "e7-8", source: "7", target: "8", type: "smoothstep" },
    { id: "e3-9", source: "3", target: "9", type: "smoothstep" },
    { id: "e9-10", source: "9", target: "10", type: "smoothstep" },
    { id: "e10-11", source: "10", target: "11", type: "smoothstep" },
    { id: "e4-12", source: "4", target: "12", type: "smoothstep" },
    { id: "e12-13", source: "12", target: "13", type: "smoothstep" },
    { id: "e13-14", source: "13", target: "14", type: "smoothstep" },
    { id: "e4-15", source: "4", target: "15", type: "smoothstep" },
    { id: "e15-16", source: "15", target: "16", type: "smoothstep" },
    { id: "e15-18", source: "15", target: "18", type: "smoothstep" },
    { id: "e18-19", source: "18", target: "19", type: "smoothstep" },
    { id: "e19-20", source: "19", target: "20", type: "smoothstep" },
    { id: "e19-21", source: "19", target: "21", type: "smoothstep" },
    { id: "e19-22", source: "19", target: "22", type: "smoothstep" },
    { id: "e18-25", source: "18", target: "25", type: "smoothstep" },
    { id: "e23-24", source: "23", target: "24", type: "smoothstep" },
    { id: "e24-25", source: "24", target: "25", type: "smoothstep" },
    { id: "e19-26", source: "19", target: "26", type: "smoothstep" },
    { id: "e26-27", source: "26", target: "27", type: "smoothstep" },
    { id: "e27-28", source: "27", target: "28", type: "smoothstep" },
    { id: "e18-19", source: "18", target: "19", type: "smoothstep" },
    { id: "e26-29", source: "26", target: "29", type: "smoothstep" },
    { id: "e26-30", source: "26", target: "30", type: "smoothstep" },
    { id: "e26-31", source: "26", target: "31", type: "smoothstep" },
    { id: "e26-32", source: "26", target: "32", type: "smoothstep" },
    { id: "e26-33", source: "26", target: "33", type: "smoothstep" },
    { id: "e26-34", source: "26", target: "34", type: "smoothstep" },
  ];

  const urls = {
    2: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    3: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    4: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    5: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    6: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
    7: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form",
    8: "https://developer.mozilla.org/en-US/docs/Web/HTML/Introduction_to_HTML/SEO",
    9: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps",
    10: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks",
    11: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
    12: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps",
    13: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
    14: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
    15: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Version_control",
    16: "https://git-scm.com/doc",
    15: "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Version_control",
    18: "https://en.wikipedia.org/wiki/Version_control_hosting_service",
    19: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
    20: "https://www.npmjs.com/",
    21: "https://pnpm.io/",
    22: "https://yarnpkg.com/",
    23: "https://github.com/",
    24: "https://about.gitlab.com/",
    25: "https://bitbucket.org/",
    26: "https://www.microverse.org/blog/best-javascript-frameworks",
    27: "https://www.browserstack.com/guide/top-css-frameworks",
    28: "https://tailwindcss.com/",
    29: "https://reactjs.org/",
    30: "https://vuejs.org/",
    31: "https://angular.io/",
    32: "https://svelte.dev/",
    33: "https://solidjs.com/",
    34: "https://qwik.builder.io/",
  };

  const handleNodeClick = (nodeId) => {
    if (urls[nodeId]) {
      window.open(urls[nodeId], "_blank", "noopener,noreferrer");
    }
  };

  const customNodeStyles = {
    width: "140px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFEB3B",
    borderRadius: "6px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "center",
  };

  return (
    <div className="h-screen w-screen overflow-scroll bg-gray-100">
      <div className="w-[1200px] h-[800px] mx-auto relative">
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "30px",
            textDecoration: "underline",
            color: "red",
          }}
        >
          Frontend Development Roadmap
        </h1>

        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            style: customNodeStyles,
            data: {
              ...node.data,
              label: (
                <div
                  onClick={() => handleNodeClick(node.id)}
                  className="w-full h-full flex items-center justify-center text-black"
                >
                  {node.data.label}
                </div>
              ),
            },
          }))}
          edges={edges}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FrontedRoadmap;
