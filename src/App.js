import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import crafts from './aircrafts.json';
import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc , doc} from 'firebase/firestore';
import { format} from 'date-fns';

function SemiNav(){

  return(
    <div id="semi_nav_container">
      <Link to="/" id="semi_nav">FRE/ACE Tail Tracker</Link>   
    </div>
  )
}



function App() {
    //const [planes, setPlanes] = useState(crafts);//json data
    const [planes, setPlanes] = useState([{}]);//firebase data

    const fetchPlanes = async () =>{//to get firebase data
      const querySnapshot = await getDocs(collection(db, 'tails'));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPlanes(newData);
    }

    useEffect(() => {
      fetchPlanes();
    }, []);


    function EditPlane(){ //-------------------------------------EDIT PLANE--------------------------------------------------------------
      let { state } = useLocation();
      

      let tempTail = state;
      let empName_T;
      let tailNum_T;
      let washed_T;
      let conditioned_T;
      let washerD;
      let condiD;
      let dateWashed_T;
      let dateConditioned_T;

      for(let index = 0; index < planes.length; index++){/*Find the plane in the array that matches the tail number sent over store data outside of this loop*/
        if(planes[index].tailNum === tempTail){
          empName_T = planes[index].empName;
          tailNum_T = planes[index].tailNum;
          washed_T = planes[index].washed ? "true" : "false";//string representation of bool
          washerD = planes[index].washed;//actual bool
          conditioned_T =planes[index].bootsCond ? "true" : "false";
          condiD = planes[index].bootsCond;
          dateConditioned_T = planes[index].dateCond;
          dateWashed_T = planes[index].dateWashed;
        }
      }

      const [washer, setWasher] = useState(washed_T); //set state variables so checkbox can be checked
      const [condi, setCondi] = useState(conditioned_T); //" "
      const [washO, setWasherO] = useState(washerD); //used to monitor if date input should be shown or not; if true, show date false = dont show
      const [condiO, setCondiO] = useState(condiD);

      const updatePlane = async () => {
        const planeRef = query(collection(db, 'tails'), where('tailNum', '==', tailNum_T));
        const findPlane = await getDocs(planeRef);
        let docID = '';

        findPlane.forEach((doc) => {
          docID = doc.id;
        });
        const getPlane = doc(db, 'tails', docID);
        await updateDoc(getPlane, {tailNum: tailNum_T, empName: empName_T, washed: washO, dateWashed: dateWashed_T, bootsCond: condiO, dateCond: dateConditioned_T});
        //----------------------------------------Below is code to update list so that react re-renders home page--------------
      /*Create a new object with values from user input */
      const updatedObject = {
          tailNum: tailNum_T, 
          empName: empName_T,
          washed: washO,
          dateWashed: dateWashed_T,
          bootsCond: condiO,
          dateCond: dateConditioned_T
        };
        

      /*Go through the list of objects and if the id matches the id passed in then put the put the updated object inside */
      const updateObjectValues = (id, newValues) => {
        setPlanes(planes => planes.map(obj => obj.id === id ? { ...obj, ...newValues } : obj));
      };

        
      updateObjectValues(docID, updatedObject);
      };//--------END OF UPDATE PLANE
      

      
      /*Using event.target.value to update variables did not completely work; the below code does. */
      function washerChange(event) {
        if(event.target.value === 'true'){
          setWasher('true');
          setWasherO(true);
        }else{
          setWasher('false');
          setWasherO(false);
        }
      }


      function condiChange(event){
        if(event.target.value === 'true'){
          setCondi('true');
          setCondiO(true);
        }else{
          setCondi('false');
          setCondiO(false);
        }
      }

      return(
        <div className='edit_plane_section'>
          <div className='editor_container'>
            <section className='current_plane_state_section edit_piece'>
              <h1 className='edit_item edit_tail'>Plane: {tailNum_T}</h1>
              <p className='edit_item'>Employee's Name: <span>{empName_T}</span></p>

              <p className='edit_item'>Washed:</p>{washed_T}
              <p className='edit_item'>Conditioned:</p>{conditioned_T}
            </section>

            <section className='changed_plane_state_section edit_piece'>
              <h1 className='edit_item edit_tail'>Plane: {tailNum_T}</h1>
              <p>Employee's Name: <input type="text" name="emp_input" id="in_id" onChange={(e) =>{
                empName_T = e.target.value;
              }} placeholder={empName_T}/></p>

              <h3>Washed:</h3>
              <div>
                <input value="false" type="checkbox" name='washer' onChange={washerChange} checked={washer === "false"}/>False
                <input value="true" type="checkbox" name='washer' onChange={washerChange} checked={washer === "true"}/>True<br/>
                <input type='date' id="dateInputWashed" name='washer_DateChoose' defaultValue={dateWashed_T} 
                  onChange={(e) => { dateWashed_T = e.target.valueAsDate.toISOString().slice(0, 10); }}
                  className={ washO ? "showDate" : "hidden"}/>
                {/*console.log("washO = "+ washO)*/}
              </div>
              
              <h3>Conditioned:</h3>
              <div>
                <input value="false" type="checkbox" name='conditioner' onChange={condiChange} checked={condi === "false"}/>False 
                <input value="true" type="checkbox" name='conditioner' onChange={condiChange} checked={condi === "true"}/>True<br />
                <input type='date' id="dateInputConditioned" name='condition_DateChoose' defaultValue={dateConditioned_T} 
                  onChange={(e) => { dateConditioned_T = e.target.valueAsDate.toISOString().slice(0, 10); }}
                  className={ condiO ? 'showDate' : 'hidden' }/>
                  {/*console.log("condiO = " + condiO)*/}
              </div>
              <br />
              
              
            </section>
            
          </div>
          <div className='submit_btn_container'>
              <Link to="/"><input className="edit_submit_btn" type='submit' onClick={() =>{
                  //Commented out section is for dealing with data from json file. I use it for testing now
                  /*planes[ind].empName = empName_T;
                  if(washO){
                    planes[ind].washed = washO;
                    planes[ind].dateWashed = format(dateWashed_T, 'MM-dd-yyyy');//this shows up in the edit page nicely but not the home page
                  }else{
                    planes[ind].washed = washO;
                  }
                  if(condiO){
                    planes[ind].bootsCond = condiO;
                    planes[ind].dateCond = format(dateConditioned_T, 'MM-dd-yyyy');
                  }else{
                    planes[ind].bootsCond = condiO;
                  }*/
                  updatePlane();//database data
                  
              }}/></Link>
            </div>
        </div>
      )
    }//---------------------------------------------END OF EDIT PLANE------------------------------------------------------------

    
  function Home(){//--------------------------------------HOME-------------------------
      return(
        <div className="App">
          <section className='card_container'>
            {
              planes.map((currentPlane) =>(
                  <Card key={currentPlane.id} plane={{ empName: currentPlane.empName, tailNum: currentPlane.tailNum, washed: currentPlane.washed, bootsCond: currentPlane.bootsCond, dateWashed: currentPlane.dateWashed, dateCond: currentPlane.dateCond }} />
              ))}
          </section>
        </div>
      )
  }

  return (//--------APP RETURN---------
      <Router>
      <SemiNav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Edit" element={<EditPlane />} />
        </Routes>
      </Router>    
  );
}//----------------------------------END OF APP-------------------------------------

export default App;


function Card({plane}){//-------------------------------------CARD--------------------------------------------------------lNum;
    const formattedDateWashed = plane.dateWashed ? format(new Date(plane.dateWashed), "MM-dd-yyyy") : "";
    const formattedDateCond = plane.dateCond ? format(new Date(plane.dateCond), "MM-dd-yyyy") : "";

      return(
      
        <section className='planeCard'>
          <section className='plane_id_section'>
            <h4 className='two_piece' id="tail_num">Tail Number: {plane.tailNum}</h4>
            <h4 className='two_piece' id="empName">Employee: {plane.empName}</h4>
          </section>
          <section className='plane_info_Section'>
            <p className='infoPiece'><strong>Washed:</strong> {plane.washed ? 'True' : 'False'}</p>
            <p className={plane.washed ? 'showDate dateBox' : 'hidden'}><strong>Date:</strong> {formattedDateWashed}</p>
            <p className='infoPiece'><strong>Boots Conditioned:</strong> {plane.bootsCond ? 'True' : 'False'}</p>
            <p className={plane.bootsCond ? 'showDate dateBox' : 'hidden'}><strong>Date:</strong> {formattedDateCond}</p>
            <br />
            <div className='edit_btn_container'>
              <button id="edit_btn"><Link to="/Edit" state={plane.tailNum} id="edit_btn_link">Edit Plane</Link></button>
            </div>      
          </section>      
        </section>
    )}//-------------------------------------END OF CARD--------------------------------------------------------

function GetPlanes(){//gets planes from json file
  let planeHolder = crafts;
  console.log(planeHolder);

  return planeHolder;

}//-----------------------------------END OF GetPlanes---------------------


function BottomNav(){
  
  
  return(
    <div>
      <li className='bottom_nav_item'>Add Plane</li>
      <li className='bottom_nav_item'>Search</li>
    </div>
  )
}