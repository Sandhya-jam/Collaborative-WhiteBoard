import { useState } from 'react'
import Background from '../components/common/Background'
import Navbar from '../components/dashboard/Navbar'
import { DashboardHero } from '../components/dashboard/DashboardHero'
import { useGetBoardsQuery } from '../features/board/boardApi'
import CreateBoardModal from '../components/dashboard/CreateBoardModal'
import RenameBoardModal from '../components/dashboard/RenameBoardModal'
import BoardCard from '../components/dashboard/BoardCard'
import DeleteBoardModal from '../components/dashboard/DeleteBoardModal'

const Dashboard = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [deleteBoard, setDeleteBoard] = useState(null);
  const {data:boards=[],isLoading}=useGetBoardsQuery();
  const [isModalOpen,setIsModalOpen]=useState(false);
  return (
    <>
    <Background/>
    <div className="min-h-screen bg-background text-text">
      <Navbar/>
      <DashboardHero 
      onCreate={()=>setIsModalOpen(true)}
      boards={boards} isLoading={isLoading} onRename={setSelectedBoard}/>
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {
            isLoading ? (<p className="text-muted">
                Loading...
            </p>)
            :boards.length===0?(
              <div className="col-span-full flex flex-col items-center py-24">
                <h2 className="text-3xl font-bold">
                    No boards yet
                </h2>
                <p className="text-muted mt-2">
                    Create your first board and start collaborating.
                </p>
              </div>
            ):(
                boards?.map((board)=>(
                  <BoardCard 
                  key={board._id}
                  board={board}
                  onRename={setSelectedBoard}
                  onDelete={setDeleteBoard}
                  />
                ))
            )
        }
        </div>
    </section>
      <CreateBoardModal open={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
      <RenameBoardModal
      open={!!selectedBoard}
      board={selectedBoard}
      onClose={()=>setSelectedBoard(null)}/>
      <DeleteBoardModal
      open={!!deleteBoard}
      board={deleteBoard}
      onClose={()=>setDeleteBoard(null)}
      />
    </div>
    </>
  )
}

export default Dashboard