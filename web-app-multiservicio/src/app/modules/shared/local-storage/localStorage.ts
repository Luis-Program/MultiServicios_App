export function setData(rol: string, idPersona: number){
  localStorage.setItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:i-t5rwz9-1fa3-mna-10",
  "30yt5f7e-dfb1-4f31-967a-61159e8558c3-b2c_1_sign_in.0ca77434-bf6d-44da-820b-56a2602c03d7-multiserviciosguate.b2clogin.com-refreshtoken-a05bc22a-7f5c-4fbe-8ef1-7fb58fca0b19----:Object-p:"+idPersona);
  localStorage.setItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:r-t5rwz9-1fa3-mna-99",
  "30yt5f7e-dfb1-4f31-967a-61159e8558c3-b2c_1_sign_in.0ca77434-bf6d-44da-820b-56a2602c03d7-multiserviciosguate.b2clogin.com-refreshtoken-a05bc22a-7f5c-4fbe-8ef1-7fb58fca0b19----:Object-r:"+rol);
}

export function getRol(){
  const data = localStorage.getItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:r-t5rwz9-1fa3-mna-99");
  let rol = null;
  if (data) {
    rol = data.substring(184,data.length);
  }
  return rol;
}

export function getIdPersona(){
  const data = localStorage.getItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:i-t5rwz9-1fa3-mna-10");
  let idPersona = null;
  if (data) {
    idPersona = data.substring(184,data.length);
  }
  return idPersona;
}

export function clearData(){
  localStorage.removeItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:r-t5rwz9-1fa3-mna-10");
  localStorage.removeItem("9th6-tg20-211t-3t65-3gqs-token-data-claims:i-t5rwz9-1fa3-mna-10");
}
