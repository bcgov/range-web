import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { formatDateFromServer } from '../pdf/helper';
import { Status } from '../../common';
// import moment from 'moment';
// import classnames from 'classnames';
// import Status from '../../common/Status';
import { useUser } from '../../../providers/UserProvider';

const FuturePlansDropdownList = ({ futurePlans, open }) => {
  const user = useUser();

  const futurePlanOptions = futurePlans.map((v) => ({
    key: v.futurePlan,
    value: v,
    text: `v${v.futurePlan}`,
    futurePlan: v,
  }));

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box margin={0} style={{ marginBottom: '10px' }}>
            <Typography variant="h6" gutterBottom component="div">
              Extension plan
            </Typography>
            <Table size="small" aria-label="dates">
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'grey' }}>
                    Plan Start Date
                  </TableCell>
                  <TableCell style={{ color: 'grey' }}>Plan End Date</TableCell>
                  <TableCell style={{ color: 'grey', align: 'left' }}>
                    Status
                  </TableCell>
                  <TableCell style={{ color: 'grey' }}></TableCell>
                  <TableCell style={{ color: 'grey' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {futurePlanOptions.map((option, index) => {
                  return (
                    <>
                      <TableRow key={index} hover={true}>
                        <TableCell align="left">
                          {formatDateFromServer(
                            option.futurePlan.planStartDate,
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {formatDateFromServer(option.futurePlan.planEndDate)}
                        </TableCell>
                        <TableCell align="left">
                          {option.futurePlan ? (
                            <Status
                              user={user}
                              status={option.futurePlan.status}
                            />
                          ) : (
                            <span>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default FuturePlansDropdownList;
