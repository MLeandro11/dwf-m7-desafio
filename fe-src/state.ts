const API_BASE_URL = process.env.API_BASE_URL;

const state = {
  data: {
    pets: [],
    myPetsLost: []
  },
  listeners: [],
  init() {
    const userData: any = localStorage.getItem("user-data");
    if (!userData) {
      return;
    } else {
      const cs = this.getState();
      const data = JSON.parse(userData);
      cs.token = data.token;
      cs.email = data.email;
      this.setState(cs);
    }
  },
  setRouteToGo(route: string) {
    const cs = this.getState();
    cs.route = route;
    this.setState(cs);
  },
  setLocation(lat, lng) {
    const cs = this.getState();
    cs.lat = lat;
    cs.lng = lng;
    this.setState(cs);
  },
  async getPetsLost(callback) {
    const { lat, lng } = this.getState();
    if (!lat && !lng) {
      console.error("error al obtener mascotas");
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/mascotas-cerca-de?lat=${lat}&lng=${lng}`
      );
      const data = await res.json();
      const petsLost = data.filter(p => p.lost == true);
      const cs = this.getState();
      cs.pets = petsLost;
      this.setState(cs);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async sendReport(report) {
    if (!report) {
      console.error("error al enviar el reporte");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });
      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  },
  async validateEmail(email: string, callback) {
    if (!email) {
      console.error("falta email");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/email/${email}`);
      const data = await res.json();
      const cs = this.getState();
      cs.emailInDataBase = data.exists;
      cs.email = email
      this.setState(cs);
      callback()
    } catch (error) {
      console.error(error);
    }
  },
  async signIn(password: String, callback?) {
    const { email } = this.getState();
    if (!email || !password) {
      console.error("error signIn");
    }
    try {
      const res = await fetch(API_BASE_URL + "/auth/token", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, email }),
      });
      const data = await res.json();
      const cs = this.getState();
      cs.token = data.token;
      this.setState(cs);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async signUp(dataUser, callback?) {
    const { email } = this.getState();
    const newUser = { ...dataUser, email };
    if (!newUser) {
      console.error("error signUp");
    }
    try {
      const res = await fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      const cs = this.getState();
      cs.dataUser = data;
      this.setState(cs);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async getUser(callback) {
    const { token } = this.getState();
    if (!token) {
      console.error("falta token");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      const data = await res.json()
      const cs = this.getState();
      cs.dataUser = data;
      this.setState(cs);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async updateDataUser(changes, callback?) {
    const { token } = this.getState();
    if (!token || !changes) {
      console.error("falta token o data del user a actualizar");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(changes),
      })
      const data = await res.json()
      console.log(data);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async reportMyPet(dataPet, callback) {
    const { token } = this.getState();
    if (!token || !dataPet) {
      console.error("falta token o data de mascota");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me/reports`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(dataPet),
      })
      const data = await res.json()
      console.log(data);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async getMyPetsLost() {
    const { token } = this.getState();
    if (!token) {
      console.error("falta token");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me/reports`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      const data = await res.json()
      const cs = this.getState();
      cs.myPetsLost = data;
      this.setState(cs);
    } catch (error) {
      console.error(error);
    }
  },
  petToEdit(id) {
    const petsLost = this.getState().myPetsLost
    const pet = petsLost.find(p => p.id == id.petId)
    const cs = this.getState()
    cs.pet = {
      id: pet.id,
      name: pet.name,
      lat: pet.lat,
      lng: pet.lng,
      picture_URL: pet.picture_URL,
      lost: pet.lost
    }
    this.setState(cs)

  },
  async updatePet(dataPet, callback?) {
    const { token, pet } = this.getState();
    if (!token || !pet) {
      console.error("falta token o pet");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me/reports/${pet.id}`, {
        method: "put",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(dataPet),
      })
      const data = await res.json()
      console.log(data);
      callback();
    } catch (error) {
      console.error(error);
    }
  },
  async deletePet(callback) {
    const { token, pet } = this.getState();
    if (!token || !pet) {
      console.error("falta token o pet");
    }
    try {
      const res = await fetch(`${API_BASE_URL}/me/reports/${pet.id}`, {
        method: "delete",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      })
      const data = await res.json()
      console.log(data);
      callback();
    } catch (error) {
      console.error(error);
    }
  }
  ,
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    const { email, token } = newState;
    email &&
      token &&
      localStorage.setItem("user-data", JSON.stringify({ email, token }));
    console.log("Soy el state, he cambiado", this.data);
  },
  subscribe(callback) {
    this.listeners.push(callback);
  },
};

export { state };
