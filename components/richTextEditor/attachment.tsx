import React, { FC } from 'react';
import { Button } from '../ui/button';
import { EyeIcon, XIcon } from 'lucide-react';
import Preview from './preview';

type Props = {
  file: File;
  index: number;
  handleRemoveFile?: (index: number) => void;
};

const Attachment: FC<Props> = ({ file, index, handleRemoveFile }) => {
  return (
    <div
      key={file.name}
      className="inline-flex items-center justify-between bg-gray-100 pl-2 rounded-md"
    >
      {file.name}

      <Preview file={file} />

      {handleRemoveFile && (
        <Button
          onClick={() => handleRemoveFile(index)}
          variant="ghost"
          size="icon"
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
};

export default Attachment;
