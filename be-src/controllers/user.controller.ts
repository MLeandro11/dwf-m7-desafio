import { Auth, Pet, User } from "../models/index";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";
import { getSHA256ofString } from "./auth.controller";

export async function verifyEmail(email: string) {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  return user;
}
export async function getDataUser(userId) {
  const dataUser = await Auth.findByPk(userId);
  return dataUser;
}

export async function updateDataUser(userId, dataUser) {
  const auth = await Auth.findOne({ where: { user_id: userId } });
  if (dataUser.fullname) {
    const user = await User.findByPk(userId);
    await user.update({ fullname: dataUser.fullname });
    await auth.update({ fullname: dataUser.fullname });
  }
  if (dataUser.password) {
    await auth.update({ password: getSHA256ofString(dataUser.password) });
  }
  return;
}

export async function reportMyPet(userId, dataPet) {
  try {
    const result = await cloudinary.uploader.upload(dataPet.dataURL);
    const pet = await Pet.create({
      name: dataPet.name,
      picture_URL: result.url,
      lat: dataPet.lat,
      lng: dataPet.lng,
      location: dataPet.location,
      userId,
    });

    const algoliaRes = await index.saveObject({
      objectID: pet.get("id"),
      name: dataPet.name,
      lost: pet.get("lost"),
      location: dataPet.location,
      photo: result.url,
      _geoloc: {
        lat: dataPet.lat,
        lng: dataPet.lng,
      },
    });
    return pet;

  } catch (error) {
    throw console.error('error de', error);

  }

}

export async function getMyReports(userId) {
  const myPets = await Pet.findAll({
    where: {
      userId,
    },
    include: { all: true, nested: true },
  });
  return myPets;
}
export async function getOneReport(userId, petId) {
  const myPet = await Pet.findOne({
    where: {
      id: petId,
      userId,
    },
    include: { all: true, nested: true },
  });

  return myPet;
}

export const updateReport = async (userId, petId, dataPet) => {
  const updateFields: any = {};
  const changeAlgolia: any = {};

  if (dataPet.dataURL) {
    const { url } = await cloudinary.uploader.upload(dataPet.dataURL);
    updateFields.picture_URL = url;
    changeAlgolia.photo = url;
  }
  if (dataPet.name) {
    updateFields.name = dataPet.name;
    changeAlgolia.name = dataPet.name;
  }
  if (dataPet.lost || !dataPet.lost) {
    updateFields.lost = dataPet.lost;
    changeAlgolia.lost = dataPet.lost;
  }
  if (dataPet.location) {
    updateFields.location = dataPet.location;
    changeAlgolia.location = dataPet.location;
  }
  if (dataPet.lat && dataPet.lng) {
    updateFields.lat = dataPet.lat;
    updateFields.lng = dataPet.lng;
    changeAlgolia._geoloc = {
      lat: dataPet.lat, lng: dataPet.lng
    }
  }

  await Pet.update(updateFields, {
    where: {
      id: petId,
      userId
    }
  });

  const algoliaRes = await index.partialUpdateObject({
    objectID: petId,
    ...changeAlgolia
  })

}

export const deleteReport = async (userId, petId) => {
  await Pet.destroy({
    where: {
      id: petId,
      userId
    }
  });
  const algoliaRes = await index.deleteObject(petId)
}