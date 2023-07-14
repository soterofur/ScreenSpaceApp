import React, { useState } from 'react';
import { Button, View } from 'react-native';
import ApprovalMessage from './Notifications';

const TestingNotification = () => {
  const [approved, setApproved] = useState(false);
  const [disApproved, setDisApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
  };

  const handleDisapprove = () => {
    setDisApproved(true);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Approve" onPress={handleApprove} />
      <Button title="Disapprove" onPress={handleDisapprove} />
      
      {approved ? <ApprovalMessage
        approved={approved}
        message={"This is an approval message"}
        onClose={() => setApproved(false)}
      />: null}

    {disApproved ?
      <ApprovalMessage
        disApproved={disApproved}
        message={"This is a disapproval message"}
        onClose={() => setDisApproved(false)}
      />: null}
      
    </View>
  );
};

export default TestingNotification;