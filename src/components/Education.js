import React, {Component} from 'react';
import uniqid from "uniqid";

class Education extends Component {
    constructor(){
        super()
        this.state = {
            education: {
                schoolName: "",
                studyTitle: "",
                studyDateFrom: "",
                studyDateTo: "",
                id: uniqid()
            },
            educationStudies: [],
        }
    }

    handleSchoolNameChange = e => {
        this.setState({
            education: {
                schoolName: e.target.value,
                studyTitle: this.state.education.studyTitle,
                studyDateFrom: this.state.education.studyDateFrom,
                studyDateTo: this.state.education.studyDateTo,
                id: this.state.education.id
            }
        })
    }

    handleStudyTitleChange = e => {
        this.setState({
            education: {
                schoolName: this.state.education.schoolName,
                studyTitle: e.target.value,
                studyDateFrom: this.state.education.studyDateFrom,
                studyDateTo: this.state.education.studyDateTo,
                id: this.state.education.id
            }
        })
    }

    handleStudyDateFromChange = e => {
        this.dateValidity("studyDateFromInput","studyDateToInput")
        this.setState({
            education: {
                schoolName: this.state.education.schoolName,
                studyTitle: this.state.education.studyTitle,
                studyDateFrom: e.target.value,
                studyDateTo: this.state.education.studyDateTo,
                id: this.state.education.id
            }
        })
    }

    handleStudyDateToChange = e => {
        this.dateValidity("studyDateFromInput","studyDateToInput")
        this.setState({
            education: {
                schoolName: this.state.education.schoolName,
                studyTitle: this.state.education.studyTitle,
                studyDateFrom: this.state.education.studyDateFrom,
                studyDateTo: e.target.value,
                id: this.state.education.id
            }
        })
    }

    handleStudyDateToOngoingChange = e => {
        if(e.target.checked){
            this.setState({
                education: {
                    schoolName: this.state.education.schoolName,
                    studyTitle: this.state.education.studyTitle,
                    studyDateFrom: this.state.education.studyDateFrom,
                    studyDateTo: "",
                    id: this.state.education.id
                }
            })
        }else{
            this.setState({
                education: {
                    schoolName: this.state.education.schoolName,
                    studyTitle: this.state.education.studyTitle,
                    studyDateFrom: this.state.education.studyDateFrom,
                    studyDateTo: "ongoing",
                    id: this.state.education.id
                }
            })
        }
    }

    dateValidity(fromInputID, toInputID){
        let objectFrom = document.getElementById(fromInputID)
        let objectTo = document.getElementById(toInputID)
        let dateStringFrom = new Date(objectFrom.value)
        let dateStringTo = new Date(objectTo.value)
        if(dateStringFrom<dateStringTo){
            objectTo.setCustomValidity("")
            objectTo.checkValidity()
            objectFrom.setCustomValidity("")
            objectFrom.checkValidity()
            return true
        }else if(dateStringFrom>dateStringTo){
            objectFrom.setCustomValidity(false)
            objectFrom.checkValidity()
            objectTo.setCustomValidity(false)
            objectTo.checkValidity()
            return false
        }else{}
    }

    toggleForm = e => {
        if(e.target.classList == "close"){
            this.collapse(e)
            e.target.classList="add"
        }else{
            this.expand(e)
            e.target.classList="close"
        }
    }

    expand = e => {
        document.querySelectorAll(".editable").forEach((ele)=>{
            ele.classList.remove("editable")
            ele.querySelector("button").classList="edit"
            ele.querySelector("button").textContent="edit"
        })
        document.querySelector(".educationForm").style.display="flex"
    }

    collapse = e => {
        let form = document.querySelector(".educationForm")
        form.reset()
        form.classList.remove("submitted")
        for(let key in this.state.education){
            if(key!=="id"){
                document.querySelector(`[for="${key}Input"]`).style.visibility="hidden"
                document.getElementById(`${key}Input`).style.pointerEvents="all"
            }
        }
        form.style.display="none"
    }

    submitEducationSection = e => {
        e.preventDefault()
        document.querySelectorAll("button.close").forEach((e)=>{
            e.classList = "add"
        })
        document.querySelector(`.educationForm`).classList.add("submitted")
        let failedKey = [];
        for(let key in this.state.education){
            if(key!=="id"&&document.getElementById(`${key}Input`).checkValidity()==false){
                document.querySelector(`[for="${key}Input"]`).style.visibility="visible"
                failedKey.push(key)
            }
        }
        if(failedKey.length===0){ 
            let updatedArray = this.state.educationStudies.concat(this.state.education) .sort((a,b)=>{
                if(a.studyDateFrom > b.studyDateFrom) return 1;
                if(a.studyDateFrom < b.studyDateFrom) return -1;
                return 0;
            });
            this.setState({
                educationStudies: updatedArray,
                education: {
                    schoolName: "",
                    studyTitle: "",
                    studyDateFrom: "",
                    studyDateTo: "",
                    id: uniqid(),
                }
            })
            document.querySelector(`.educationForm`).classList.remove("submitted")
            document.querySelector(`.educationForm`).querySelectorAll("form").forEach((e)=>e.reset())
            this.collapse(e)
        } else{}
    }

    handleEditEducationStudiesEntry = (e, id) => {
        let index = this.state.educationStudies.findIndex((e)=>{if(e.id==id){return true}})
        let changedElement = e.target.id.slice(0,(-1*(id.length+5)))
        let changedValue = e.target.value
            this.setState(({educationStudies}) => ({
                educationStudies: [
                    ...educationStudies.slice(index-1,index),
                    {
                        ...educationStudies[index],
                        [changedElement]: changedValue,
                    },
                    ...educationStudies.slice(index+1)
                ]
            }));
    }

    deleteEditEducationStudiesEntry = (e, id) => {
        e.preventDefault()
        let index = this.state.educationStudies.findIndex((e)=>{if(e.id==id){return true}})
        this.setState(({educationStudies}) => ({
            educationStudies: [
                ...educationStudies.slice(index-1,index),
                ...educationStudies.slice(index+1)
            ]
        }));
    }

    toggleEditEducationStudiesEntry = (e, id) => {
        e.preventDefault()
        this.collapse()
        if(e.target.parentNode.parentNode.classList.contains("editable")){
            e.target.parentNode.parentNode.classList.add("submitted")
            let index = this.state.educationStudies.findIndex((e)=>{if(e.id==id){return true}})
            let failedKey = [];
            for(let key in this.state.educationStudies[index]){
                if(key!=="id"&&document.getElementById(`${key}Input${id}`).checkValidity()==false){
                    document.querySelector(`[for="${key}Input${id}"]`).style.visibility="visible"
                    failedKey.push(key)
                }
            }
            if(failedKey.length===0){
                e.target.parentNode.parentNode.classList.remove("submitted")
                e.target.parentNode.parentNode.classList.remove("editable")
                e.target.classList = "edit"
            }
        }else{
            e.target.parentNode.parentNode.classList.add("editable")
            e.target.classList = "confirm"
        }
        e.target.parentNode.parentNode.querySelectorAll(".span").forEach((e)=>{
            e.style.visibility="hidden"
        })
    }
    
    render() {
        const { education, educationStudies } = this.state;
        return (
            <>
                <h2>Educational Experience
                    <button 
                        className="add" 
                        onClick={(e)=>{this.toggleForm(e)}}
                    ></button>
                </h2>
                <form className="educationForm">
                    <div>
                        <button className='confirm' onClick={(e)=>this.submitEducationSection(e)}>confirm</button>
                    </div>
                    <div>
                        <input
                            id="schoolNameInput"
                            type="text"
                            required
                            placeholder="School Name"
                            maxLength="50"
                            rows={1}
                            autoComplete="off"
                            onChange={(e)=>this.handleSchoolNameChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="schoolNameInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="schoolNameInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="schoolNameInput"><p>*required</p><p>{education.schoolName.length}/50</p></span>
                    </div>
                    <div>
                        <input
                            id="studyTitleInput"
                            type="text"
                            required
                            placeholder="Studies Title"
                            maxLength="50"
                            rows={1}
                            autoComplete="off"
                            onChange={(e)=>this.handleStudyTitleChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="studyTitleInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="studyTitleInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="studyTitleInput"><p>*required</p><p>{education.studyTitle.length}/50</p></span>
                    </div>
                    <div>
                        <div>
                            <input
                                id="studyDateFromInput" 
                                type="text"
                                required
                                placeholder="Start date"
                                maxLength="50"
                                rows={1}
                                onInput={(e)=>{
                                    this.handleStudyDateFromChange(e)
                                    this.dateValidity("studyDateFromInput","studyDateToInput")
                                }}
                                onFocus={(e)=>{
                                    e.target.type="date";
                                    document.querySelector('[for="studyDateFromInput"]').style.visibility ="visible";
                                }}
                                onBlur={(e)=>{
                                    document.querySelector('[for="studyDateFromInput"]').style.visibility ="hidden";
                                }}
                            />
                            <span htmlFor="studyDateFromInput"><p>*required</p><p></p></span>
                        </div>
                        <input
                            id="studyDateToOngoingInput"
                            type="checkbox"
                            defaultChecked
                            onChange={(e)=>{
                                if(e.target.checked==true){
                                    this.handleStudyDateToOngoingChange(e)
                                    document.getElementById("studyDateToInput").type="text"
                                    document.getElementById("studyDateToInput").value=""
                                    document.getElementById("studyDateToInput").placeholder = "Finish date"
                                    document.getElementById("studyDateToInput").disabled=false
                                    document.getElementById("studyDateToInput").style.pointerEvents="all"
                                    this.dateValidity("studyDateFromInput", "studyDateToInput")
                                }else{
                                    this.handleStudyDateToOngoingChange(e)
                                    document.getElementById("studyDateToInput").type="text"
                                    document.getElementById("studyDateToInput").value="Ongoing"
                                    document.getElementById("studyDateToInput").style.pointerEvents="none"
                                    this.dateValidity("studyDateFromInput", "studyDateToInput")
                                }
                            }}
                        />
                        <div>
                            <input
                                id="studyDateToInput" 
                                type="text"
                                required
                                placeholder="Finish date"
                                maxLength="50"
                                rows={1}
                                onInput={(e)=>{
                                    this.handleStudyDateToChange(e)
                                    this.dateValidity("studyDateFromInput","studyDateToInput")
                                }}
                                onFocus={(e)=>{
                                    e.target.type="date";
                                    document.querySelector('[for="studyDateToInput"]').style.visibility ="visible";
                                }}
                                onBlur={(e)=>{
                                    document.querySelector('[for="studyDateToInput"]').style.visibility ="hidden";
                                }}
                            />
                            <span htmlFor="studyDateToInput"><p>*cannot be before start date</p><p></p></span>
                        </div>
                    </div>
                </form>
                {educationStudies.map((education)=>{
                    return (
                        <form key={education.id} className="educationSection">
                            <div>
                                <button className='edit' onClick={(e)=>{this.toggleEditEducationStudiesEntry(e, education.id)}}>
                                </button>
                                <button className='delete' onClick={(e)=>{this.deleteEditEducationStudiesEntry(e, education.id)}}>
                                </button>
                            </div>
                            <div>
                                <label htmlFor={`schoolNameInput${education.id}`}>School:</label>
                                <input
                                    id={`schoolNameInput${education.id}`}
                                    type="text"
                                    defaultValue={education.schoolName}
                                    required
                                    placeholder="School Name"
                                    maxLength="50"
                                    rows={1}
                                    autoComplete="off"
                                    onChange={(e)=>this.handleEditEducationStudiesEntry(e, education.id)}
                                    onFocus={(e)=>{document.querySelector(`[for="schoolNameInput${education.id}"]`).style.visibility ="visible"}}
                                    onBlur={(e)=>{document.querySelector(`[for="schoolNameInput${education.id}"]`).style.visibility ="hidden"}}
                                />
                                <span htmlFor={`schoolNameInput${education.id}`}><p>{education.schoolName.length}/50</p></span>
                            </div>
                            <div>
                                <label htmlFor={`studyTitleInput${education.id}`}>Studies:</label>
                                <input
                                    id={`studyTitleInput${education.id}`}
                                    type="text"
                                    defaultValue={education.studyTitle}
                                    required
                                    placeholder="Title of Studies"
                                    maxLength="50"
                                    rows={1}
                                    autoComplete="off"
                                    onChange={(e)=>this.handleEditEducationStudiesEntry(e, education.id)}
                                    onFocus={(e)=>{document.querySelector(`[for="studyTitleInput${education.id}"]`).style.visibility ="visible"}}
                                    onBlur={(e)=>{document.querySelector(`[for="studyTitleInput${education.id}"]`).style.visibility ="hidden"}}
                                />
                                <span htmlFor={`studyTitleInput${education.id}`}><p>{education.studyTitle.length}/50</p></span>
                            </div>
                            <div>
                                <div>
                                <label htmlFor={`studyDateFromInput${education.id}`}>Start:</label>
                                    <input
                                        id={`studyDateFromInput${education.id}`}
                                        type="text"
                                        defaultValue={education.studyDateFrom}
                                        required
                                        placeholder="Start date"
                                        maxLength="50"
                                        rows={1}
                                        onChange={(e)=>{
                                            this.handleEditEducationStudiesEntry(e, education.id)
                                            this.dateValidity(`studyDateFromInput${education.id}`,`studyDateToInput${education.id}`)
                                        }}
                                        onFocus={(e)=>{
                                            e.target.type="date"
                                            document.querySelector(`[for="studyDateFromInput${education.id}`).style.visibility ="visible";
                                        }}
                                        onBlur={(e)=>{
                                            e.target.type="text"
                                            document.querySelector(`[for="studyDateFromInput${education.id}`).style.visibility ="hidden";
                                        }}
                                    />
                                    <span htmlFor={`studyDateFromInput${education.id}`}><p>*required</p><p></p></span>
                                </div>
                                <input
                                    id="studyDateToOngoingInput"
                                    type="checkbox"
                                    defaultChecked
                                    onChange={(e)=>{
                                        if(e.target.checked==true){
                                            document.getElementById(`studyDateToInput${education.id}`).type="text"
                                            document.getElementById(`studyDateToInput${education.id}`).value=""
                                            document.getElementById(`studyDateToInput${education.id}`).placeholder = "Finish date"
                                            document.getElementById(`studyDateToInput${education.id}`).disabled=false
                                            document.getElementById(`studyDateToInput${education.id}`).style.pointerEvents="all"
                                            this.dateValidity(`studyDateFromInput${education.id}`, `studyDateToInput${education.id}`)
                                        }else{
                                            document.getElementById(`studyDateToInput${education.id}`).type="text"
                                            document.getElementById(`studyDateToInput${education.id}`).value="Ongoing"
                                            document.getElementById(`studyDateToInput${education.id}`).style.pointerEvents="none"
                                            this.dateValidity(`studyDateFromInput${education.id}`, `studyDateToInput${education.id}`)
                                        }
                                    }}
                                />
                                <div>
                                    <label htmlFor={`studyDateToInput${education.id}`}>Finish:</label>
                                    <input
                                        id={`studyDateToInput${education.id}`}
                                        type="text"
                                        defaultValue={education.studyDateTo}
                                        required
                                        placeholder="Finish date"
                                        maxLength="50"
                                        rows={1}
                                        onChange={(e)=>{
                                            this.handleEditEducationStudiesEntry(e, education.id)
                                            this.dateValidity(`studyDateFromInput${education.id}`,`studyDateToInput${education.id}`)
                                        }}
                                        onFocus={(e)=>{
                                            e.target.type="date"
                                            document.querySelector(`[for="studyDateToInput${education.id}`).style.visibility ="visible";
                                        }}
                                        onBlur={(e)=>{
                                            e.target.type="text"
                                            document.querySelector(`[for="studyDateToInput${education.id}`).style.visibility ="hidden";
                                        }}
                                    />
                                    <span htmlFor={`studyDateToInput${education.id}`}><p>*cannot be before start date</p><p></p></span>
                                </div>
                            </div>
                        </form>
                    )
                })}
            </>
        );
    }
}

export default Education;