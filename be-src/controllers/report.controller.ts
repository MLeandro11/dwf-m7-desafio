import { Pet, Report, User } from "../models";
import { sendgrid } from "../lib/sendgrid";
export async function createReport(dataReport) {
    const report = await Report.create({
        reporter: dataReport.reporter,
        phone_number: dataReport.phone_number,
        message: dataReport.message,
        petId: dataReport.petId
    })
    const pet = await Pet.findByPk(dataReport.petId, {
        include: {
            model: User,
            as: 'user'
        }
    })
    const userOwnerPet = {
        name: pet.getDataValue('user').fullname,
        email: pet.getDataValue('user').email,
    }
    const msg = {
        to: userOwnerPet.email,
        from: "leandrolm87@gmail.com",
        subject: "¡Nueva información sobre tu mascota!",
        text: '¡Nueva información sobre tu mascota!',
        html: `
	    <h1>Información sobre su mascota perdida</h1>
	    <p>Estimado/a ${userOwnerPet.name},</p>
	    <p>Mi nombre es <strong> ${dataReport.reporter}</strong>. Quería ponerme en contacto con usted para darle el siguiente mensaje</p>
        <p>${dataReport.message}</p>
	    <p>Si está interesado/a en obtener más información sobre el paradero de su mascota, no dude en ponerse en contacto conmigo en el siguiente número de teléfono: <strong> <a href="tel:${dataReport.phone_number}"> ${dataReport.phone_number}</a></strong>. Estaré disponible para hablar con usted en cualquier momento que le resulte conveniente.</p>
	    <p>Espero poder ayudarle a encontrar a su mascota perdida.</p>
	    <p>Atentamente,</p>
	    <p><strong> ${dataReport.reporter}</strong></p>
        `,
    };
    await sendgrid(msg);

    return report

}
export const getReports = async () => {
    const reports = await Report.findAll({
        include: [Pet]
    })
    return reports

}