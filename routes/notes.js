const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.body.id });
  res.json(notes);
});

router.post(
  "/savenote",
  fetchuser,
  async (req, res) => {
    console.log(req.body);
    try {
      const { title, description, tag } = req.body.req;
      const note = new Notes({ title, description, tag, user: req.body.id });

      const savedNote = await Notes.create(note);
      res.json(savedNote);
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put(
    "/updatenote/:id",
    fetchuser,
    async (req, res) => {
      try {
        const { title, description, tag} = req.body.req;
        const newNote = {};
        if (title) {
            newNote.title = title;
        }

        if (tag) {
            newNote.tag = tag;
        }

        if (description) {
            newNote.description = description;
        }

        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        if (note.user.toString() != req.body.id) {
            return res.status(401).send("Unauthorized");
        }

        const updatedNote = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({"Success": "Deleted successfully"});
      } catch (error) {
          console.log(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );


router.delete(
    "/deletenote/:id",
    fetchuser,
    async (req, res) => {
      try {
        const note = await Notes.findById(req.params.id);
        if (note.user.toString() != req.body.id) {
            res.status(401).send("Unauthorized");
        }

        if (!note) {
            res.status(404).send("Not Found");
        }

        const deletedNote = await Notes.findByIdAndDelete(req.params.id);
        res.json(deletedNote);
      } catch (error) {
          console.log(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

module.exports = router;
