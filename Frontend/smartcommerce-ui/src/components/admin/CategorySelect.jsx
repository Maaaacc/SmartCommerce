// src/components/admin/CategorySelect.jsx
import { TextField, MenuItem } from "@mui/material";
import { COLORS } from "../../theme/colors";

const fieldSx = {
  mb: 2.5,
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    borderRadius: "8px",
    minHeight: "56px",
    "& fieldset": { borderColor: COLORS.border },
    "&:hover fieldset": { borderColor: COLORS.primary },
    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: "1.5px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "16.5px 14px",
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    "&.Mui-focused": { color: COLORS.primary },
  },
};

function CategorySelect({
  value,
  onChange,
  categories = [],
  currentCategoryId = null,
  disabled = false,
  mode = "parent",
  label = "Category",
}) {
  const availableCategories = categories
    .filter((cat) => {
      if (mode === "children") {
        const hasChildren = categories.some(
          (c) => (c.parentId ?? c.parent_id) === cat.id
        );
        const hasParent = !!(cat.parentId ?? cat.parent_id);
        return !cat.isDeleted && !hasChildren && hasParent;
      }

      if (cat.id === currentCategoryId) return false;
      const isDirectChildOfCurrent =
        (cat.parentId ?? cat.parent_id) === currentCategoryId;
      if (isDirectChildOfCurrent) return false;
      const isTopLevel = !(cat.parentId ?? cat.parent_id);
      return isTopLevel;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectValue = value == null ? "" : value;
  const emptyLabel =
    mode === "children" ? "Select a category" : "No parent (top-level)";

  return (
    <TextField
      select
      label={label}
      value={selectValue}
      onChange={onChange}
      fullWidth
      disabled={disabled}
      sx={fieldSx}
    >
      <MenuItem value="">
        <em>{emptyLabel}</em>
      </MenuItem>
      {availableCategories.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>
          {cat.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default CategorySelect;