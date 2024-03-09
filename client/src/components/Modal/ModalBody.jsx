const ModalBody = ({ children, title, subtitle, onClick, childrenBtn }) => {
  return (
    <div class="bg-gray flex items-center justify-center h-screen">
      <div class="fixed z-10 inset-0 flex items-center justify-center">
        <div class="absolute inset-0 bg-gray-500 opacity-40" />
        <div class="relative bg-white rounded-lg overflow-hidden shadow-xl max-w-screen-md m-4 w-full max-sm:h-full max-sm:m-0">
          <div class="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className='text-xl font-medium'>{title}</h1>
              <p className='text-lg mt-2 w-[150px] text-dark-grey line-clamp-1'>{subtitle}</p>
            </div>

            <button class="flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={onClick}>
              <i class="fi fi-rr-cross text-2xl mt-1"></i>
            </button>
          </div>

          <div class="prose px-6 pt-4 pb-6 overflow-y-auto max-h-[35rem] border border-dark-grey/10 shadow-md max-sm:max-h-[40rem]">
            {children}
          </div>

          {childrenBtn &&
            <div class="bg-white px-4 py-3 sm:px-6 flex align-items justify-end p-4 gap-4 flex-row">
              {childrenBtn}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ModalBody;
