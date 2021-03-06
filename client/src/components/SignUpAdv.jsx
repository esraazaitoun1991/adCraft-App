import React from "react";
import "../style/styles.css";
import $ from "jquery";
import { browserHistory } from 'react-router';
import {
  Paper,
  Button,
  FormLabel,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Typography
} from "@material-ui/core";
import PNG from '../style/signup.png';
import DropDown from './DropDownMenu.jsx'
import ImgCompAdd from './ImgCompAdd.jsx'
const axios = require("axios");



export default class SignUpAdv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      password: "",
      gender: "male",
      open: false,
      location: "",
      img: null,
      category: 0,
      errorPhone: "",
      errorPassword: "",
      validation: false,
      isSignUp: false,
      categories: []
    };
    this.handleOnClick = this.handleOnClick.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }


  componentDidMount() {

    $.ajax({
      url: '/categories',
      type: 'GET',
      contentType: 'application/json',
      success: (res) => {
        if (res.data.length > 0){
          this.setState({categories : res.data})
        }
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  // this function to deal eith the textField and get the data
  handleChange(e) {
    e.preventDefault();
    let target = e.target;
    this.setState({ [target.name]: target.value });
    console.log(this.state[target.name]);
    // validation to  phone number
    if (this.state.phoneNumber.length < 9) {
      this.setState({
        errorPhone: "The phone number should be in this format 0790011200",
        validation: false
      });
    } else {
      this.setState({
        errorPhone: "",
        validation: true
      });
    }
    // validation to  password
    if (this.state.password.length < 8) {
      this.setState({
        errorPassword: "The password should be more than 8 character!",
        validation: false
      });
    } else {
      this.setState({
        errorPassword: "",
        validation: true
      });
    }
  }

  // handle when click to send info to server
  handleOnClick(e) {
    e.preventDefault();
    // console.log(this.state);
    // // if the validation true  send data
    // if (this.state.validation) {
    //   $.ajax({
    //     url: '/sign-up',
    //     type: 'POST',
    //     contentType: 'application/json',
    //     data: JSON.stringify({
    //       firstName: this.state.firstName,
    //       lastName: this.state.lastName,
    //       phoneNumber: this.state.phoneNumber,
    //       password: this.state.password,
    //       gender: this.state.gender,
    //       img: this.state.img,
    //       location: this.state.location,
    //       category: this.state.category,
    //       id_roles: 2
    //     }),
    //     success: (res) => {
          
    //     },
    //     error: (err) => {
    //       console.log('err', err);
    //     }
    //   });
    // }
  }

  //helping ImgComp
  getImg(img) {
    this.setState({ img: img })
    console.log(this.state.img)
  }
  // help DropDownMenu to get category id 
  getCategoryId(id) {
    this.setState({ category: id })
    console.log(this.state.category)
  }



  onFormSubmit(e) {
    e.preventDefault();
    let  data= JSON.stringify({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      password: this.state.password,
      gender: this.state.gender,
      img: this.state.img,
      location: this.state.location,
      category: this.state.category,
      id_roles: 2
    })
    const formData = new FormData();
    formData.append('myAdvImage', this.state.img);
    formData.append('advertiser', data)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //!!!
    axios.post("/sign-up-adv", formData, config)
      .then((res) => {
        if (res.data.success !== 'userExist') {
          browserHistory.push({
            pathname: "/adv-profile/" + res.data.data.id,
            state: { user: res.data.data }
          });
        } else {
          alert("This user is exist");
        }
      }).catch((error) => {
      });
  }



  onClick(e) {
    this.handleOnClick(e)
    this.onFormSubmit(e)
  }


  render() {


    return (
      <Grid container md style={{ display: "flex", justifyContent: "center" }}>
        <Paper style={{ padding: "30px", width: "60%", margin: "20px" }}>
          <div>
            <Typography variant="display2" align="center" color="primary" >
              <img src={PNG} width="100" height="100" alt="" />
              <Typography className="_Signup" variant="display2" align="center" style={{ "color": "#006789" }}>
                Sign Up As Advertiser
              </Typography>
            </Typography>
          </div>
          <form action="/sign-up-adv" method="post" encType="multipart/form-data">
            <ImgCompAdd getImg={this.getImg.bind(this)} />
            <div>
              <DropDown 
                getCategoryId={this.getCategoryId.bind(this)}
                categories = {this.state.categories}
              />
            </div>
            <TextField
              label="First Name"
              required={true}
              name="firstName"
              margin="normal"
              value={this.state.firstName}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              type="text"
              name="lastName"
              required={true}
              margin="normal"
              value={this.state.lastName}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              label="Location"
              type="text"
              name="location"
              required={true}
              margin="normal"
              value={this.state.location}
              onChange={this.handleChange}
              fullWidth
            />

            <TextField
              label="Phone Number"
              type="number"
              required={true}
              placeholder="0790022543"
              name="phoneNumber"
              margin="normal"
              value={this.state.phoneNumber}
              onChange={this.handleChange}
              fullWidth
            />
            <Typography
              variant="caption"
              style={{ color: "#006789" }}
              gutterBottom
              align="justify"
            >
              {this.state.errorPhone}
            </Typography>
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              required={true}
              margin="normal"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            <Typography
              variant="caption"
              style={{ color: "#006789" }}
              gutterBottom
              align="justify"
            >
              {this.state.errorPassword}
            </Typography>
            <FormControl style={{ marginTop: "10px" }} component="fieldset">
              <FormLabel style={{ color: "#006789" }} component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="Gender"
                value={this.state.gender}
                onChange={this.handleChange}
                name="gender"
              >
                <FormControlLabel
                  value="male"
                  control={<Radio style={{ color: "#006789" }} />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio style={{ color: "#006789" }} />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
            <Button
              onClick={this.onClick}
              className="btnStyle"
              color="inherit"
              style={{ backgroundColor: "#006789" }}
              type="submit"
              fullWidth
            >
              Sign Up
            </Button>
          </form>
          <Button
            style={{
              marginTop: "15px",
              size: "medium",
              textTransform: "lowercase"
            }}
            color="default"
            fullWidth
          >
            Already have an Account?
          </Button>
        </Paper>
      </Grid>
    );
  }

}



