import React, {Component} from 'react';
import uniqid from "uniqid";

class Practical extends Component {
    constructor(){
        super()
        this.state = {
            practical: {
                companyName: "",
                positionTitle: "",
                mainTasks: "",
                workDateFrom: "",
                workDateTo: "",
                id: uniqid()
            },
            practicalExperience: [],
        }
    }

    handleCompanyNameChange = e => {
        this.setState({
            practical: {
                companyName: e.target.value,
                positionTitle: this.state.practical.positionTitle,
                mainTasks: this.state.practical.mainTasks,
                workDateFrom: this.state.practical.workDateFrom,
                workDateTo: this.state.practical.workDateTo,
                id: this.state.practical.id
            }
        })
    }

    handlePositionTitleChange = e => {
        this.setState({
            practical: {
                companyName: this.state.practical.companyName,
                positionTitle: e.target.value,
                mainTasks: this.state.practical.mainTasks,
                workDateFrom: this.state.practical.workDateFrom,
                workDateTo: this.state.practical.workDateTo,
                id: this.state.practical.id
            }
        })
    }

    handleMainTasksChange = e => {
        this.setState({
            practical: {
                companyName: this.state.practical.companyName,
                positionTitle: this.state.practical.positionTitle,
                mainTasks: e.target.value,
                workDateFrom: this.state.practical.workDateFrom,
                workDateTo: this.state.practical.workDateTo,
                id: this.state.practical.id
            }
        })
    }

    handleWorkDateToChange = e => {
        this.dateValidity("workDateFromInput","workDateToInput")
        this.setState({
            practical: {
                companyName: this.state.practical.companyName,
                positionTitle: this.state.practical.positionTitle,
                mainTasks: this.state.practical.mainTasks,
                workDateFrom: this.state.practical.workDateFrom,
                workDateTo: e.target.value,
                id: this.state.practical.id
            }
        })
    }


    handleWorkDateFromChange = e => {
        this.dateValidity("workDateFromInput","workDateToInput")
        this.setState({
            practical: {
                companyName: this.state.practical.companyName,
                positionTitle: this.state.practical.positionTitle,
                mainTasks: this.state.practical.mainTasks,
                workDateFrom: e.target.value,
                id: this.state.practical.id
            }
        })
    }

    handleWorkDateToOngoingChange = e => {
        if(e.target.checked){
            this.setState({
                practical: {
                    companyName: this.state.practical.companyName,
                    positionTitle: this.state.practical.positionTitle,
                    mainTasks: this.state.practical.mainTasks,
                    workDateFrom: this.state.practical.workDateFrom,
                    workDateTo: "",
                    id: this.state.practical.id
                }
            })
        }else{
            this.setState({
                practical: {
                    companyName: this.state.practical.companyName,
                    positionTitle: this.state.practical.positionTitle,
                    mainTasks: this.state.practical.mainTasks,
                    workDateFrom: this.state.practical.workDateFrom,
                    workDateTo: "ongoing",
                    id: this.state.practical.id
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
        }else if(dateStringFrom>dateStringTo){
            objectFrom.setCustomValidity(false)
            objectFrom.checkValidity()
            objectTo.setCustomValidity(false)
            objectTo.checkValidity()
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
        document.querySelector(".practicalForm").style.display="flex"
    }

    collapse = e => {
        let form = document.querySelector(".practicalForm")
        form.reset()
        form.classList.remove("submitted")
        for(let key in this.state.practical){
            if(key!=="id"){
                document.querySelector(`[for="${key}Input"]`).style.visibility="hidden"
                document.getElementById(`${key}Input`).style.pointerEvents="all"
            }
        }
        form.style.display="none"
    }

    submitPracticalSection = e => {
        e.preventDefault()
        document.querySelectorAll("button.close").forEach((e)=>{
            e.classList = "add"
        })
        document.querySelector(`.practicalForm`).classList.add("submitted")
        let failedKey = [];
        for(let key in this.state.practical){
            if(key!=="id"&&document.getElementById(`${key}Input`).checkValidity()==false){
                document.querySelector(`[for="${key}Input"]`).style.visibility="visible"
                failedKey.push(key)
            }
        }
        if(failedKey.length===0){
            let updatedArray = this.state.practicalExperience.concat(this.state.practical) .sort((a,b)=>{
                if(a.workDateFrom > b.workDateFrom) return 1;
                if(a.workDateFrom < b.workDateFrom) return -1;
                return 0;
            });
            this.setState({
                practicalExperience: updatedArray,
                practical: {
                    companyName: "",
                    positionTitle: "",
                    mainTasks: "",
                    workDateFrom: "",
                    workDateTo: "",
                    id: uniqid(),
                }
            })
            document.querySelector(`.practicalForm`).classList.remove("submitted")
            document.querySelector(`.practicalForm`).querySelectorAll("form").forEach((e)=>e.reset())
            this.collapse(e)
        } else{}
    }

    handleEditPracticalEntry = (e, id) => {
        let index = this.state.practicalExperience.findIndex((e)=>{if(e.id==id){return true}})
        let changedElement = e.target.id.slice(0,(-1*(id.length+5)))
        let changedValue = e.target.value
        this.setState(({practicalExperience}) => ({
            practicalExperience: [
                ...practicalExperience.slice(index-1,index),
                {
                    ...practicalExperience[index],
                    [changedElement]: changedValue,
                },
                ...practicalExperience.slice(index+1)
            ]
        }));
    }

    deleteEditPracticalEntry = (e, id) => {
        e.preventDefault()
        let index = this.state.practicalExperience.findIndex((e)=>{if(e.id==id){return true}})
        this.setState(({practicalExperience}) => ({
            practicalExperience: [
                ...practicalExperience.slice(index-1,index),
                ...practicalExperience.slice(index+1)
            ]
        }));
    }

    toggleEditPracticalEntry = (e, id) => {
        e.preventDefault()
        this.collapse()
        if(e.target.parentNode.parentNode.classList.contains("editable")){
            e.target.parentNode.parentNode.classList.add("submitted")
            let index = this.state.practicalExperience.findIndex((e)=>{if(e.id==id){return true}})
            let failedKey = [];
            for(let key in this.state.practicalExperience[index]){
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
        const { practical, practicalExperience } = this.state;
        return (
            <>
                <h2>Practical Experience
                    <button 
                        className="add" 
                        onClick={(e)=>{this.toggleForm(e)}}
                    ></button>
                </h2>
                <form className="practicalForm">
                    <div>
                        <button className='confirm' onClick={(e)=>this.submitPracticalSection(e)}>confirm</button>
                    </div>
                    <div>
                        <input
                            id="companyNameInput"
                            type="text"
                            required
                            placeholder="Company Name"
                            maxLength="50"
                            rows={1}
                            autoComplete="off"
                            onChange={(e)=>this.handleCompanyNameChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="companyNameInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="companyNameInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="companyNameInput"><p>*required</p><p>{practical.companyName.length}/50</p></span>
                    </div>
                    <div>
                        <input
                            id="positionTitleInput"
                            type="text"
                            required
                            placeholder="Position Title"
                            maxLength="50"
                            rows={1}
                            autoComplete="off"
                            onChange={(e)=>this.handlePositionTitleChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="positionTitleInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="positionTitleInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="positionTitleInput"><p>*required</p><p>{practical.positionTitle.length}/50</p></span>
                    </div>
                    <div>
                        <input
                            id="mainTasksInput"
                            type="text"
                            required
                            placeholder="Main Tasks"
                            maxLength="50"
                            rows={1}
                            autoComplete="off"
                            onChange={(e)=>this.handleMainTasksChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="mainTasksInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="mainTasksInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="mainTasksInput"><p>*required</p><p>{practical.mainTasks.length}/50</p></span>
                    </div>
                    <div>
                        <div>
                            <input
                                id="workDateFromInput" 
                                type="text"
                                required
                                placeholder="Start date"
                                maxLength="50"
                                rows={1}
                                onChange={(e)=>{
                                    this.handleWorkDateFromChange(e)
                                    this.dateValidity("workDateFromInput", "workDateToInput")
                                }}
                                onFocus={(e)=>{
                                    e.target.type="date";
                                    document.querySelector('[for="workDateFromInput"]').style.visibility ="visible";
                                }}
                                onBlur={(e)=>{
                                    document.querySelector('[for="workDateFromInput"]').style.visibility ="hidden";
                                }}
                            />
                            <span htmlFor="workDateFromInput"><p>*required</p><p></p></span>
                        </div>
                        <input
                            id="workDateToOngoingInput"
                            type="checkbox"
                            defaultChecked
                            onChange={(e)=>{
                                if(e.target.checked==true){
                                    this.handleWorkDateToOngoingChange(e)
                                    document.getElementById("workDateToInput").type="text"
                                    document.getElementById("workDateToInput").value=""
                                    document.getElementById("workDateToInput").placeholder = "Finish date"
                                    document.getElementById("workDateToInput").disabled=false
                                    document.getElementById("workDateToInput").style.pointerEvents="all"
                                    document.querySelector(`[for="workDateToInput"]`).style.visibility ="visible"
                                    this.dateValidity("workDateFromInput", "workDateToInput")
                                }else{
                                    this.handleWorkDateToOngoingChange(e)
                                    document.getElementById("workDateToInput").type="text"
                                    document.getElementById("workDateToInput").value="Ongoing"
                                    document.getElementById("workDateToInput").style.pointerEvents="none"
                                    document.querySelector(`[for="workDateToInput"]`).style.visibility ="hidden"
                                    this.dateValidity("workDateFromInput", "workDateToInput")
                                }
                            }}
                        />
                        <div>
                            <input
                                id="workDateToInput" 
                                type="text"
                                required
                                placeholder="Finish date"
                                maxLength="50"
                                rows={1}
                                onChange={(e)=>{
                                    this.handleWorkDateToChange(e)
                                    this.dateValidity("workDateFromInput","workDateToInput")
                                }}
                                onFocus={(e)=>{
                                    e.target.type="date";
                                    document.querySelector('[for="workDateToInput"]').style.visibility ="visible";
                                }}
                                onBlur={(e)=>{
                                    document.querySelector('[for="workDateToInput"]').style.visibility ="hidden";
                                }}
                            />
                            <span htmlFor="workDateToInput"><p>*cannot be before start date</p><p></p></span>
                        </div>
                    </div>
                </form>
                {practicalExperience.map((practical)=>{
                    return (
                        <form key={practical.id} className="practicalSection">
                            <div>
                                <button className='edit' onClick={(e)=>{this.toggleEditPracticalEntry(e, practical.id)}}>
                                </button>
                                <button className='delete' onClick={(e)=>{this.deleteEditPracticalEntry(e, practical.id)}}>
                                </button>
                            </div>
                            <div>
                                <label htmlFor={`companyNameInput${practical.id}`}>Company name:</label>
                                <input
                                    id={`companyNameInput${practical.id}`}
                                    type="text"
                                    defaultValue={practical.companyName}
                                    required
                                    placeholder="School Name"
                                    maxLength="50"
                                    rows={1}
                                    autoComplete="off"
                                    onChange={(e)=>this.handleEditPracticalEntry(e, practical.id)}
                                    onFocus={(e)=>{document.querySelector(`[for="companyNameInput${practical.id}"]`).style.visibility ="visible"}}
                                    onBlur={(e)=>{document.querySelector(`[for="companyNameInput${practical.id}"]`).style.visibility ="hidden"}}
                                />
                                <span htmlFor={`companyNameInput${practical.id}`}><p>{practical.companyName.length}/50</p></span>
                            </div>
                            <div>
                                <label htmlFor={`positionTitleInput${practical.id}`}>Position:</label>
                                <input
                                    id={`positionTitleInput${practical.id}`}
                                    type="text"
                                    defaultValue={practical.positionTitle}
                                    required
                                    placeholder="Title of Studies"
                                    maxLength="50"
                                    rows={1}
                                    autoComplete="off"
                                    onChange={(e)=>this.handleEditPracticalEntry(e, practical.id)}
                                    onFocus={(e)=>{document.querySelector(`[for="positionTitleInput${practical.id}"]`).style.visibility ="visible"}}
                                    onBlur={(e)=>{document.querySelector(`[for="positionTitleInput${practical.id}"]`).style.visibility ="hidden"}}
                                />
                                <span htmlFor={`positionTitleInput${practical.id}`}><p>{practical.positionTitle.length}/50</p></span>
                            </div>
                            <div>
                                <label htmlFor={`mainTasksInput${practical.id}`}>Main Tasks:</label>
                                <input
                                    id={`mainTasksInput${practical.id}`}
                                    type="text"
                                    defaultValue={practical.mainTasks}
                                    required
                                    placeholder="Main tasks"
                                    maxLength="50"
                                    rows={1}
                                    autoComplete="off"
                                    onChange={(e)=>this.handleEditPracticalEntry(e, practical.id)}
                                    onFocus={(e)=>{document.querySelector(`[for="mainTasksInput${practical.id}"]`).style.visibility ="visible"}}
                                    onBlur={(e)=>{document.querySelector(`[for="mainTasksInput${practical.id}"]`).style.visibility ="hidden"}}
                                />
                                <span htmlFor={`mainTasksInput${practical.id}`}><p>{practical.mainTasks.length}/50</p></span>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor={`workDateFromInput${practical.id}`}>Start:</label>
                                    <input
                                        id={`workDateFromInput${practical.id}`}
                                        type="text"
                                        defaultValue={practical.workDateFrom}
                                        required
                                        placeholder="Start date"
                                        maxLength="50"
                                        rows={1}
                                        onChange={(e)=>{
                                            this.handleEditPracticalEntry(e, practical.id)
                                            this.dateValidity(`workDateFromInput${practical.id}`,`workDateToInput${practical.id}`)
                                        }}
                                        onFocus={(e)=>{
                                            e.target.type="date"
                                            document.querySelector(`[for="workDateFromInput${practical.id}`).style.visibility ="visible";
                                        }}
                                        onBlur={(e)=>{
                                            e.target.type="text"
                                            document.querySelector(`[for="workDateFromInput${practical.id}`).style.visibility ="hidden";
                                        }}
                                    />
                                    <span htmlFor={`workDateFromInput${practical.id}`}><p>*required</p><p></p></span>
                                </div>
                                <input
                                    id="workDateToOngoingInput"
                                    type="checkbox"
                                    defaultChecked
                                    onChange={(e)=>{
                                        if(e.target.checked==true){
                                            document.getElementById(`workDateToInput${practical.id}`).type="text"
                                            document.getElementById(`workDateToInput${practical.id}`).value=""
                                            document.getElementById(`workDateToInput${practical.id}`).placeholder = "Finish date"
                                            document.getElementById(`workDateToInput${practical.id}`).disabled=false
                                            document.getElementById(`workDateToInput${practical.id}`).style.pointerEvents="all"
                                            this.dateValidity(`workDateFromInput${practical.id}`, `workDateToInput${practical.id}`)
                                        }else{
                                            document.getElementById(`workDateToInput${practical.id}`).type="text"
                                            document.getElementById(`workDateToInput${practical.id}`).value="Ongoing"
                                            document.getElementById(`workDateToInput${practical.id}`).style.pointerEvents="none"
                                            this.dateValidity(`workDateFromInput${practical.id}`, `workDateToInput${practical.id}`)
                                        }
                                    }}
                                />
                                <div>
                                    <label htmlFor={`workDatetoInput${practical.id}`}>Finish:</label>
                                    <input
                                        id={`workDateToInput${practical.id}`}
                                        type="text"
                                        defaultValue={practical.workDateTo}
                                        required
                                        placeholder="Finish date"
                                        maxLength="50"
                                        rows={1}
                                        onChange={(e)=>{
                                            this.handleEditPracticalEntry(e, practical.id)
                                            this.dateValidity(`workDateFromInput${practical.id}`,`workDateToInput${practical.id}`)
                                        }}
                                        onFocus={(e)=>{
                                            e.target.type="date"
                                            document.querySelector(`[for="workDateToInput${practical.id}`).style.visibility ="visible";
                                        }}
                                        onBlur={(e)=>{
                                            e.target.type="text"
                                            document.querySelector(`[for="workDateToInput${practical.id}`).style.visibility ="hidden";
                                        }}
                                    />
                                    <span htmlFor={`workDateToInput${practical.id}`}><p>*cannot be before start date</p><p></p></span>
                                </div>
                            </div>
                        </form>
                    )
                })}
            </>
        );
    }
}

export default Practical;