import { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Data:', data);
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Selected type:', type);
  }, [type]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Filtrer les événements par type et pagination
  const filteredEvents = data.events.filter((event) => {
    const matchType = !type || event.type === type;
    // eslint-disable-next-line no-console
    if (!matchType) {
      console.log('Event filtered out due to type mismatch:', event);
    }
    return matchType;
  }).filter((event, index) => {
    const start = (currentPage - 1) * PER_PAGE;
    const end = currentPage * PER_PAGE;
    const inPage = index >= start && index < end;
    // eslint-disable-next-line no-console
    if (!inPage) {
      console.log('Event filtered out due to pagination:', event);
    }
    return inPage;
  });

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  const totalEvents = data.events.filter(event => !type || event.type === type).length;
  const pageNumber = Math.ceil(totalEvents / PER_PAGE);

  // eslint-disable-next-line no-console
  console.log('Filtered events:', filteredEvents);
  // eslint-disable-next-line no-console
  console.log('Total events:', totalEvents);
  // eslint-disable-next-line no-console
  console.log('Page number:', pageNumber);

  // Créer la liste des types d'événements
  const typeList = Array.from(new Set(data.events.map((event) => event.type)));

  return (
    <>
      {error && <div>An error occurred</div>}
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList}
        onChange={(value) => changeType(value)}
      />
      <div id="events" className="ListContainer">
        {filteredEvents.map((event) => (
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>
      <div className="Pagination">
        {[...Array(pageNumber)].map((_, n) => (
          // eslint-disable-next-line react/no-array-index-key
          <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
            {n + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;
