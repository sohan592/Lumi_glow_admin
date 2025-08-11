import { createSlice } from "@reduxjs/toolkit";

export interface StateType {
  parentId: number | any;
  directoryIdx: string | undefined | null;
  title: string;
  key: string | number;
}

const initialState: StateType = {
  parentId: null,
  directoryIdx: null,
  title: "",
  key: "",
};

export const mediaSlice = createSlice({
  name: "media_folder_parent",
  initialState,

  reducers: {
    mediaFolderParentInfo: (state, action) => {
      state.parentId = action.payload.parentId;
      state.directoryIdx = action.payload.directoryIdx;
      state.title = action.payload.title;
      state.key = action.payload.key;
    },
  },
});

export const { mediaFolderParentInfo } = mediaSlice.actions;

export default mediaSlice.reducer;
