import { useParams } from "react-router";
import MusicDetailsContent from "./MusicDetailsContent"; 

const MusicDetails = () => {
  const { id } = useParams();
  return <MusicDetailsContent id={id!} />;
};

export default MusicDetails;