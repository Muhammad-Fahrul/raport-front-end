import './raportTable.css';

import { useGetRaportsByUsernameQuery } from '../../pages/raport/redux/raportApiSlice';

import { memo, useCallback, useState } from 'react';

import { Raport } from './raport/Raport';
import { RaportDetail } from './raportDetail/RaportDetail';

import PropTypes from 'prop-types';

const RaportTable = ({ username }) => {
  const [detailRaport, setDetailRaport] = useState({});
  const [screen, setScreen] = useState(false);

  const { data, isSuccess, isLoading, isError, error } =
    useGetRaportsByUsernameQuery(username);

  const handleDetail = useCallback(
    (id) => {
      const detailRaport = data.raports.find((raport) => raport._id === id);

      setDetailRaport(detailRaport);
      setScreen(true);
    },
    [data?.raports]
  );

  let raportsContent;

  if (isLoading) {
    return <p>loading...</p>;
  } else if (isSuccess) {
    const { raports } = data;
    raportsContent = raports?.length
      ? raports.map((raport) => (
          <Raport
            key={raport._id}
            raport={raport}
            handleDetail={handleDetail}
          />
        ))
      : null;
  } else if (isError) {
    return <p>{error.data.message}</p>;
  }
  return (
    <div>
      <div className="container-table-raport">
        <table className="table-raport">
          <thead>
            <tr>
              <th>Chapter</th>
              <th>Verse</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>{raportsContent}</tbody>
        </table>
      </div>

      {screen && <RaportDetail raport={detailRaport} setScreen={setScreen} />}
    </div>
  );
};

RaportTable.propTypes = {
  username: PropTypes.string.isRequired,
};

const areEqual = (prevProp, nextProp) => {
  return prevProp.username === nextProp.username;
};

const memoizedRaportTable = memo(RaportTable, areEqual);

export { memoizedRaportTable as RaportTable };
