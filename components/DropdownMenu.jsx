import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownMenu = ({ data, selectedValue, onSelect, placeholder }) => {
  return (
    <View>
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onChange={(item) => onSelect(item.value)}
        style={{
          height: 40,
        }}
      />
    </View>
  );
};

export default DropdownMenu;
