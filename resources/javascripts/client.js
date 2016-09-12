import React from "react";
import ReactDOM from "react-dom";

require("./master.scss");


import Layout from "./Layout/Layout.js";

const app = document.getElementById('app');

ReactDOM.render(<Layout/>, app);
