import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useFormContext, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    '& label': {
      fontSize: 18,
    },
    '& .MuiInputBase-input': {
      fontSize: '16px !important',
    },
  },
}));

const InputController = ({
  type = 'text',
  name,
  label,
  defaultValue,
  required,
  rules,
  InputProps,
  select = false, 
  options = [], 
  ...props
}) => {
  const classes = useStyles();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          type={type}
          label={label}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : null}
          InputProps={InputProps}
          className={classes.root}
          select={select} 
          {...props}
        >
          {select &&
            options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </TextField>
      )}
      rules={{ required: required && `(*) ${label} is required`, ...rules }}
    />
  );
};

export default InputController;