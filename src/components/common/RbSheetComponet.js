import React, {forwardRef, memo} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { colors } from '../../constants';

const RbSheetCompnonet = forwardRef(
  (
    {children, height, bgColor, wrapperColor, containerStyle, close = true},
    ref,
  ) => {
    return (
      <RBSheet
        ref={ref}
        closeOnDragDown={close}
        closeOnPressMask={close}
        // useNativeDriver={true}
        height={height}
        customStyles={{
          wrapper: {
            backgroundColor:"#2D3C5257",
          },
          container: {
            backgroundColor: bgColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            ...containerStyle,
          },
          draggableIcon: {
            backgroundColor: colors.light.primary,
          },
        }}>
        {children}
      </RBSheet>
    );
  },
);

export default memo(RbSheetCompnonet);
