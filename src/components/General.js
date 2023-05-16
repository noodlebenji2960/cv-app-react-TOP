import React, {Component} from 'react';
import telCountryCodes from '../telCountryCodes';
import Stylebar from './stylesBar.js';

class General extends Component {
    constructor(){
        super()
        this.state = {
            profilePic: "",
            name: "",
            email: "",
            telCountryCode: "",
            phoneNumber: "",
            profileDescription: "",
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    handleEmailChange = e => {
        this.setState({
            email: e.target.value
        })
    }

    handlePhoneNumberChange = e => {
        if(e.target.id=="telCountryCodeInput"&&e.target.value!=""){
            e.target.style.color = "black"
        }
        let countryCodeInput = document.getElementById("telCountryCodeInput")
        countryCodeInput.checkValidity()
        if(countryCodeInput.value==="default"){
            countryCodeInput.setCustomValidity(false)
        }else{
            countryCodeInput.setCustomValidity("")
        }

        let phoneNumberInput = document.getElementById("phoneNumberInput")
        if(countryCodeInput.checkValidity()||phoneNumberInput.checkValidity()){
            this.setState({
                telCountryCode: countryCodeInput.value,
                phoneNumber: phoneNumberInput.value
            })
        }
    }

    handleProfileDescriptionChange = e => {
        e.target.checkValidity()
        this.setState({
            profileDescription: e.target.value
        })
        
        e.target.style.height = `${e.target.scrollHeight-(parseInt(window.getComputedStyle(e.target, null).getPropertyValue('padding'))*2)}px`
    }

    confirmGeneral = (e) => {
        e.preventDefault()
        let countryCodeInput = document.getElementById("telCountryCodeInput")
        countryCodeInput.checkValidity()
        if(countryCodeInput.value===""){
            countryCodeInput.setCustomValidity(false)
            countryCodeInput.checkValidity()
        }else{
            countryCodeInput.setCustomValidity("")
            countryCodeInput.checkValidity()
        }

        document.querySelector(`.generalForm`).classList.add("submitted")
        let nodeList = e.target.parentNode.querySelectorAll(".editable")
        if(e.target.classList=="edit"){
            e.target.parentNode.classList.add("editable")
            e.target.parentNode.classList.remove("uneditable")
            e.target.classList="confirm"
        }else{
            let failedKey = [];
            for(let key in this.state){
                let validity = document.getElementById(`${[key]}Input`).checkValidity()
                if(key!=="profilePic"){
                    if(this.state[key]=== ""||validity===false){
                        failedKey.push(key)
                    }
                }
            }
            if(failedKey.length===0){
                    document.querySelector(`.generalForm`).classList.remove("submitted")
                    e.target.parentNode.classList.remove("editable")
                    e.target.parentNode.classList.add("uneditable")
                    e.target.classList = "edit"
            }else{
                for(let i=0;i<failedKey.length;i++){
                    document.querySelector(`[for="${[failedKey[i]]}Input"]`).style.visibility="visible"
                }
            }
        }
        nodeList.forEach((e)=>{
            e.classList.remove("editable")
            e.classList.add("uneditable")
            e.querySelector("button").classList="edit"
        })
    }

    handleProfilePicChange(e) {
        if(e.target.files.length>0){
            this.setState({
                profilePic: URL.createObjectURL(e.target.files[0])
              })
        }else{
        }
      }

    render() {
        const { profilePic, name, email, telCountryCode, phoneNumber, profileDescription } = this.state;
        return (
            <>
                <h2>General Information <Stylebar/></h2>
                <form className='generalForm'>
                    <button onClick={(e)=>this.confirmGeneral(e)} className='confirm'></button>
                    <div>
                            <label id="profilePicPreview" htmlFor='profilePicInput'>
                                    <img
                                        src={this.state.profilePic}
                                    />
                                </label>
                            <input
                                id="profilePicInput"
                                type="file"
                                onChange={(e)=>{
                                    this.handleProfilePicChange(e)
                                }}
                            />
                            <span htmlFor="profilePicInput"><p></p><p>{this.state.name.length}/50</p></span>
                    </div>
                    <div>
                    <div>
                        <input
                            id="nameInput"
                            type="text"
                            required
                            defaultValue={name} 
                            placeholder="Name"
                            maxLength="50"
                            rows={1}
                            onChange={(e)=>this.handleNameChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="nameInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="nameInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="nameInput"><p>*required</p><p>{this.state.name.length}/50</p></span>
                    </div>
                    <div>
                        <input
                            id="emailInput"
                            type="email"
                            required
                            defaultValue={email} 
                            placeholder="Email"
                            maxLength="50"
                            rows={1}
                            onChange={(e)=>this.handleEmailChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="emailInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="emailInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="emailInput"><p>*valid email address format required</p><p>{this.state.email.length}/50</p></span>
                    </div>
                    <div>
                        <div>
                            <select
                                id="telCountryCodeInput"
                                title="international calling code"
                                onChange={(e)=>this.handlePhoneNumberChange(e)}
                                onBlur={(e)=>{document.querySelector('[for="telCountryCodeInput"]').style.visibility ="hidden"}}
                                required
                                defaultValue={telCountryCode}>
                                <option value="">tel.codes</option>
                                {telCountryCodes.map((item, i) => (
                                    <option key={i} value={item.dial_code}>{item.code} {item.dial_code}
                                    </option>
                                ))}
                            </select>
                            <span htmlFor="telCountryCodeInput"><p>*required</p><p></p></span>
                        </div>
                        <div>
                            <input
                                id="phoneNumberInput"
                                type="tel"
                                required
                                defaultValue={phoneNumber} 
                                placeholder="Phone number"
                                maxLength="16"
                                rows={1}
                                onChange={(e)=>this.handlePhoneNumberChange(e)}
                                onFocus={(e)=>{document.querySelector('[for="phoneNumberInput"]').style.visibility ="visible"}}
                                onBlur={(e)=>{document.querySelector('[for="phoneNumberInput"]').style.visibility ="hidden"}}
                            />
                            <span htmlFor="phoneNumberInput"><p>*required</p><p>{this.state.phoneNumber.length}/16</p></span>
                        </div>
                    </div>
                    <div>
                        <textarea
                            id="profileDescriptionInput" 
                            type="text"
                            required
                            defaultValue={profileDescription} 
                            placeholder="Profile Description"
                            minLength="100"
                            maxLength="650"
                            rows={1}
                            onChange={(e)=>this.handleProfileDescriptionChange(e)}
                            onFocus={(e)=>{document.querySelector('[for="profileDescriptionInput"]').style.visibility ="visible"}}
                            onBlur={(e)=>{document.querySelector('[for="profileDescriptionInput"]').style.visibility ="hidden"}}
                        />
                        <span htmlFor="profileDescriptionInput"><p>*100 characters minimum</p><p>{this.state.profileDescription.length}/650</p></span>
                    </div>
                    </div>
                </form>
          </>
        );
    }
}

export default General;