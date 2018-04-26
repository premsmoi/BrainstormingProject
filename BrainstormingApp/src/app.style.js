import { StyleSheet } from "react-native";
import { scale } from './Configuration' 

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageIcon: {
    width: 24*scale, 
    height: 24*scale, 
    marginVertical: 5*scale, 
    marginHorizontal: 10*scale
  },
  headerText: {
    fontSize: 30*scale, 
    color: 'grey',
  },
  listText: {
    fontSize: 20*scale, 
    color: 'black',  
  },
  detailText: {
    fontSize: 16*scale, 
    color: 'black',  
  },
  textButton: {
    fontSize: 16*scale, 
    color: '#70cdef'
  },
  buttonContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 10*scale,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14*scale,
    color: 'black',
    marginVertical: 5*scale,
    marginHorizontal: 10*scale,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
});