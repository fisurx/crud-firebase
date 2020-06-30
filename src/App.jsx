import React from 'react';
import { useEffect, useState } from "react";
import {firebase} from "./firebase"

function App() {

  const [tareas, setTareas] = useState([]) 
  const [tarea, setTarea] = useState("")
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState("")


  useEffect(() => {
    const getData = async () =>{

      try{
        const db = firebase.firestore()
        const data = await db.collection("tareas").get()

        console.log(data.docs.map(doc => ({ id: doc.id, ...doc.data()})))
        const arrayData = await data.docs.map(doc => ({ id: doc.id, ...doc.data()}))
        setTareas(arrayData);

      } catch (error){
        console.log(error)
      }

    }

    
    getData()
  },[])

  const agregar = async (e) => {
    e.preventDefault()
    
    if(!tarea.trim()){
      alert("no me sirve reynald, esta vacio")
      return //el return funciona como un break dentro del ciclo
    } 

    try {
      const db = firebase.firestore()
      const newTask = {
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection("tareas").add(newTask) //el ID es random, por lo tanto solo colocamos los campos que van en la coleccion
      setTareas([
        ...tareas,
        {...newTask, id: data.id}
      ])

    } catch (error) {
      console.log(error)
    }

    console.log("tarea")
  }

  const eliminar = async (id) =>{
    try{
      const db = firebase.firestore()
      await db.collection("tareas").doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)


    }catch (error){
      console.log(error)
    }
  }

  const activarEdicion = (item) =>{
    try {
      setModoEdicion(true)
      setTarea(item.name)
      setId(item.id)
    } catch (error) {
      console.log(error)
    }
  }

  const editar = async (e) =>{
    e.preventDefault()
    if (!tarea.trim()) {
      console.log("vacio!")
      return
    }
    try {

      const db = firebase.firestore()
      await db.collection("tareas").doc(id).update({
        name: tarea
      })

      const filteredArray = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(filteredArray)
      setModoEdicion(false)
      setTarea("")
      setId("")
    }catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-nd-6">
          <ul className="list-group">
            {
              tareas.map(item => (
                <li className="list-group-item" key={item.id}>
                  {item.name}
                  
                  <button 
                    className="btn btn-danger btn-sm float-right ml-2"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>

                  <button
                    className="btn btn-warning btn-sm float-right ml-2"
                    onClick={() => activarEdicion(item)}  
                  >
                    Editar
                  </button>

                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-md-6">
          <h3>
            { 
              modoEdicion ? "Editar Tarea" : "Agregar tarea"
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input 
            type="text"
            placeholder="Ingrese tarea"
            className="form-control mb-2" 
            onChange={e => setTarea(e.target.value)}
            value={tarea}
            />

            <button
              className={modoEdicion ? "btn btn-warning btn-block" : "btn btn-dark btn-block"}
              type="submit"
            >
            { 
              modoEdicion ? "Editar Tarea" : "Agregar tarea"
            }              
            </button>
            <br/>
            <p><center>let a task up there ;D</center></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
