import React, { useState, useEffect } from "react"


export default function Login() {
 
  const [fields, handleFieldsChange] = useFormFields({
    id: "",
    failover: "",
  
  })

  const validate = () => {
    console.log(fields);
    for(let field in fields){
      if(fields[field] === ""){
        alert("Porfavor rellene todos los campos");
        return false
      }
    }
    return true
  }


  //Sing up function
  function useFormFields(initialState) {
    const [fields, setValues] = useState(initialState);

    return [
      fields,
      function (event) {
        setValues({
          ...fields,
          [event.target.id]: event.target.value,
        });
      }
    ];
  }

  // Function render Sing up form

  const renderSignUp = () => {
    return (
      <div class="flex justify-center w-full">
        <div class="max-w-md shadow w-full bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-grey-darker text-sm font-bold mb-2" >
                id
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
              id="id"
              type="text"
              placeholder="id"
              value={fields.id}
              onChange={handleFieldsChange}
            />
          </div>
          <div class="mb-4 flex flex-col">
            <label class="text-grey-darker text-sm font-bold mb-2">
                failover
              </label>
            <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" type="text" placeholder="failover"
              id="failover"
              value={fields.failover}
              onChange={handleFieldsChange}
            />
          </div>
          <a class={`bg-blue-500 text-white w-full font-bold py-2 px-4 mb-3 `} href={`/video?id=${fields.id}&?failover=${fields.failover}`}>
            go
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen ">
      <div className="w-full h-full flex items-center justify-center">
        {renderSignUp()}
      </div>
    </div>
  )
}


