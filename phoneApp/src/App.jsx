import { useState, useEffect } from "react";
import axios from "axios";
import PersonService from "./services/Persons";

const Filter = ({ handleFilter }) => {
  return (
    <>
      <p>Filter search</p>
      <input onChange={handleFilter} />
    </>
  );
};
const SuccessNotification = ({ successMessage }) => {
  if (successMessage === null) {
    return null;
  } else if (successMessage) {
    return <div className="success">{successMessage}</div>;
  }
};
const ErrorNotification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  } else if (errorMessage) {
    return <div className="error">{errorMessage}</div>;
  }
};

const PersonForm = ({ addNewName, handleNameChange, handlePhoneChange }) => {
  return (
    <form onSubmit={addNewName}>
      <div>
        name: <input id="name-input" onChange={handleNameChange} />
      </div>
      <div>
        number: <input id="phone-input" onChange={handlePhoneChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const People = ({ peopleToShow, deletePerson }) => {
  return (
    <ul>
      {peopleToShow.map((person) => (
        <li key={person.id}>
          {" "}
          {person.name} {person.number}{" "}
          <button onClick={() => deletePerson(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    PersonService.showAll().then((people) => setPersons(people));
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const peopleToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  const addNewName = (event) => {
    event.preventDefault();

    const names = persons.map((person) => person.name.toUpperCase());
    const phones = persons.map((person) => person.number);

    const newPerson = {
      name: newName,
      number: newPhone,
    };

    if (names.includes(newName.toUpperCase()) || phones.includes(newPhone)) {
      if (confirm(`Are you sure you want to update ${newName} contact?`)) {
        PersonService.updatePerson(newPerson.name, newPerson)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.name === newPerson.name ? updatedPerson : person
              )
            );
          })
          .catch((error) => {
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
              setErrorMessage(null);
            }, 3000);
          });
        return;
      } else {
        return;
      }
    }

    PersonService.create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setSuccessMessage(returnedPerson.name + " was successfully created!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
    const phoneInput = document.getElementById("phone-input");
    const nameInput = document.getElementById("name-input");
    nameInput.value = "";
    phoneInput.value = "";
    setNewName("");
    setNewPhone("");
  };

  const deletePerson = (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      PersonService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setErrorMessage(error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
    return;
    // setPersons(persons.map((person) => person.id !== id));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification errorMessage={errorMessage} />
      <SuccessNotification successMessage={successMessage} />
      <div>
        <Filter handleFilter={handleFilter} />
      </div>
      <h3>Add a new contact</h3>
      <PersonForm
        addNewName={addNewName}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <People peopleToShow={peopleToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
