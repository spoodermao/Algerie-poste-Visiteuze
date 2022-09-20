import NavBar from "../navbar";
import AddRdvp from "./add_rdvp";
import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import axios from "axios";
import { Await } from 'react-router';
const fetch = require('node-fetch');

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ListRdv() {
  let [todos2, setTodos2] = useState([{}]);

  useEffect(() => {
    const getTodos2 = async () => {
      try {
        const response = await fetch('http://localhost:3001/get_rdv')
        const rdvp = await response.json();
        if (response.ok) {
          setTodos2(rdvp)
          console.log("response",response);
          console.log("mjghhh",rdvp, rdvp[0]);
        }
      } catch (err) {
        console.error(err.message);
        console.log("something went wrong");
      }
    }
    getTodos2();
  }, []);
  
 let tab2 = [...todos2]
  let day = new Date()
  day.setHours(0, 0, 0, 0)

console.log("this is tab2",tab2, new Date(tab2[0].date))

  let rdvs = {
    "a venir": tab2.filter(rdv => rdv.validation === 0 && day <= new Date(rdv.date)),
    "en cours": tab2.filter(rdv => rdv.validation === 1 ),
    "termines": tab2.filter(rdv => rdv.validation === 2 && day > new Date(rdv.date)),
    "annules": tab2.filter(rdv => rdv.validation === 0 && day > new Date(rdv.date)),
  }
  console.log("this is rdvs",rdvs)

  return (
    <div>
      <NavBar />
      <AddRdvp />
      <div className="w-full max-w-4xl px-2 py-16 sm:px-0 mx-auto font-poste" id='modal_table'>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-bleu p-1">
            {Object.keys(rdvs).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-base leading-5 text-bleu',
                    'ring-white ring-opacity-40 ring-offset-2 ring-offset-bleu focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-jaune hover:bg-white/[0.12] '
                  )
                }
              >
                RDVs {category}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            {Object.values(rdvs).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-gris ',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative rounded-md py-4 px-12 mb-4 mx-2 bg-gray-100  grid grid-flow-col grid-cols-4 grid-rows-6 gap-2"
                  >
                    <div className="text-2xl place-self-start font-medium col-span-3 row-span-2 font-semibold my-auto">
                      {post.nom} - {post.direction}
                    </div>

                    <div className='col-span-3 place-self-start'><b>Titre:</b> {post.titre}</div>

                    <div className='col-span-3  row-span-3 place-self-start text-left break-all'> <b>Motif:</b><br /> {post.motif}</div>

                    <div className={'row-span-2 my-auto font-semibold place-self-end '}>Le {post.date} a {post.heure_entree} </div>


                    {
                      post.validation === 2 &&
                      <div className='place-self-end font-semibold'>
                        Heure de sortie {post.heure_sortie}
                      </div>

                    }

                    {post.validation != 0 &&
                      <div className='place-self-end'>
                        Entree par {post.auteur}
                      </div>
                    }



                    {post.validation === 0 ?
                      <div className='col-span-1 row-end-6 place-self-end'>
                        <button className='bg-jaune text-bleu rounded-md px-8 py-2 '>
                          Supprimer
                        </button>
                      </div>
                      :
                      ''
                    }
                  </div>
                ))}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div >
    </div >
  )
}

export default ListRdv;