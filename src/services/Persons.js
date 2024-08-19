const base_url = "/api/persons";
import axios from "axios";

const showAll = () => {
  const request = axios.get(base_url);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(base_url, newObject);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${base_url}/${id}`);
  return request;
};

const updatePerson = (name, updatedPerson) => {
  const request = axios.put(`${base_url}/${name}`, updatedPerson);
  return request.then((response) => response.data);
};

export default {
  showAll,
  create,
  deletePerson,
  updatePerson,
};
