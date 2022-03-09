import { resolve } from "path";
import { promises as fs } from "fs";

import { bundle } from "@reactive-jsx/bundler";

import type { NextPage, InferGetServerSidePropsType } from "next";

const Home: NextPage = () => {
  return <main className="h-screen"></main>;
};

export default Home;
