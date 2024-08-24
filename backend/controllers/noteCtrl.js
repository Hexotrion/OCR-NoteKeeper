import Notes from '../models/noteModel.js';

const noteCtrl = {
    getNotes: async (req, res) => {
        try {
            const notes = await Notes.find({ user_id: req.user.id });
            res.json(notes);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createNote: async (req, res) => {
        try {
            const { title, content, date } = req.body;

            const newNote = new Notes({
                title,
                content,
                date,
                user_id: req.user.id,
                name: req.user.name
            });

            await newNote.save();
            res.json({ msg: "Created a note" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteNote: async (req, res) => {
        try {
            await Notes.findByIdAndDelete(req.params.id);
            res.json({ msg: "Deleted a note" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateNote: async (req, res) => {
        try {
            const { title, content, date } = req.body;
            await Notes.findByIdAndUpdate(req.params.id, {
                title,
                content,
                date
            });
            res.status(200).json({ msg: "Note has been updated" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getNote: async (req, res) => {
        try {
            const note = await Notes.findById(req.params.id);
            res.json(note);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

export default noteCtrl;
