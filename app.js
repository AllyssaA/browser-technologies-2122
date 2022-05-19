import 'dotenv/config';
import express from 'express';
import { fs } from 'file-system';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
// require("dotenv").config();
// const express = require("express");
// const fs = require("file-system");
// const bodyParser = require("body-parser");
// const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 7000;

app.set("view engine", "ejs");
app.set("views", "views");

// Use static folder
app.use(express.static("static"));

// Gebruik body-parser om te lezen wat er in POST requests van de form staat
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(process.env.DB_URI, {
  retryWrites: true,
  // useUnifedTopology: true
});

app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Enquete | Minor Web Development",
  });
});

let result;

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    await client.connect();
    const database = client.db("enquete");
    const collection = database.collection("entries");
    const document = {
      name: req.body.name,
      studentId: req.body.student_number,
      wafs: {
        period: req.body.wafs_period,
        teacher: req.body.wafs_teacher,
        rating: req.body.wafs_rating,
        difficultly: req.body.wafs_moeilijkheid,
        description: req.body.wafs_uitleg,
        score: req.body.wafs_selfrating,
      },
      cttr: {
        period: req.body.cttr_period,
        teacher: req.body.cttr_teacher,
        rating: req.body.cttr_rating,
        difficultly: req.body.cttr_moeilijkheid,
        description: req.body.cttr_uitleg,
        score: req.body.cttr_selfrating,
      },
    };
    await collection.insertOne(document).then(`inserted ${document.name}`);
  } catch (error) {
    console.warn(error);
  } finally {
    await client.close();
    res.render("verzonden", {
      pageTitle: "Antwoorden verzonden",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
