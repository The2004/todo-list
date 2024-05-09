notes = []

$("#addbtn").on('click',(e)=>{
    let newtext = $("#newnotetext").val()
    $("#newnotetext").val("")
    let note_id = notes.length
    let noteobj = {"text":newtext, "done":false, "note_id":note_id}
    notes.push(noteobj)
    createNewNote(noteobj)
    saveData()
})

function saveData(){
    localStorage.setItem("notes", JSON.stringify(notes))
}

function updateStats(){
    let allcount = notes.length;
    let notdonecount = 0;
    let donecount = 0

    notes.forEach(note => {
        donecount += Number(note.done)
        notdonecount += Number(!note.done)
    });

    $("#allcount").text(allcount)
    $("#donecount").text(donecount)
    $("#notdonecount").text(notdonecount)
}

function createNewNote(note){
    let newnote = document.createElement("li")
    let notetext = document.createElement("p")
    let checkbox = document.createElement("input")
    let checboxlabel = document.createElement("label")
    let notesobj = $("#listnotes")
    $(newnote).addClass("taskinlist")
    $(notetext).addClass("notetext")
    if(note.done){
        $(notetext).addClass("done")
        $(checkbox).attr("checked", "true")
    }
    $(checkbox).on("change",(e)=>{
        let noteid = ($(e.target).attr("id")).replace("note", "")
        if($(e.target).is(":checked")){
            for(let i = 0; i < notes.length; i++){
                if(notes[i].note_id != noteid){
                    continue
                }
                notes[i].done = true;
                $("[note_id=\""+noteid+"\"] > p").addClass("done")
                break;
            }
            updateStats()
            saveData()
            return;
        }
        for(let i = 0; i < notes.length; i++){
            if(notes[i].note_id != noteid){
                continue
            }
            notes[i].done = false;
            $("[note_id=\""+noteid+"\"] > p").removeClass("done")
            break;
        }
        updateStats()
        saveData()
    })
    $(checkbox).addClass("completecheck")
    $(checkbox).attr("type", "checkbox")
    $(checkbox).attr("id","note"+note.note_id)
    $(checboxlabel).text("Completed")
    $(checboxlabel).attr("for", "note"+note.note_id)
    $(newnote).attr('note_id', note.note_id)
    $(notetext).text(note.text)
    $(notetext).html($(notetext).html().replaceAll("\n","<br>"))
    newnote.appendChild(notetext)
    newnote.appendChild(checkbox)
    newnote.appendChild(checboxlabel)
    notesobj.append(newnote)
    updateStats()
}
let resetdeletebtn = 0
$("#deletenotes").on("click", (e)=>{
    let deletebtn = e.target
    let sure = Boolean(Number($(deletebtn).attr("sure")))
    if(!sure){
        $(deletebtn).attr("sure", "1")
        $(deletebtn).text("Sure?")
        resetdeletebtn = setTimeout(()=>{
            $(deletebtn).attr("sure", "0")
            $(deletebtn).text("Clear all tasks")
        },3000)
    }else{
        clearTimeout(resetdeletebtn)
        $(deletebtn).attr("sure", "0")
        $(deletebtn).text("Clear all tasks")
        notes = []
        $(".taskinlist").remove()
        updateStats()
        saveData()
    }
})


$(document.body).ready(()=>{
    if(localStorage.getItem("notes") != null){
        notes = JSON.parse(localStorage.getItem("notes"))
        for(note of notes){
            createNewNote(note)
        }
    }

    
})

$('#newnotetext').keyup(function (event) {
    if (event.keyCode == 13) {        
        if(!event.shiftKey){
            $("#addbtn").click()
        }
    }
});