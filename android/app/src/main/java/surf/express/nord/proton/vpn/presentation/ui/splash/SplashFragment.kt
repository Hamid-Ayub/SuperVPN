package surf.express.nord.proton.vpn.presentation.ui.splash

import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.NavHostFragment.findNavController
import androidx.navigation.fragment.findNavController
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.FragmentSplashBinding
import surf.express.nord.proton.vpn.domain.model.Status
import surf.express.nord.proton.vpn.presentation.base.BaseFragment
import surf.express.nord.proton.vpn.presentation.ui.ShareViewModel
import surf.express.nord.proton.vpn.presentation.utils.showToast
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SplashFragment : BaseFragment<FragmentSplashBinding>(R.layout.fragment_splash) {

    private val viewModel: SplashViewModel by viewModels()
    private val shareViewModel: ShareViewModel by activityViewModels()

    override fun initBinding(view: View): FragmentSplashBinding {
        return FragmentSplashBinding.bind(view)
    }

    override fun initView() {
        viewModel.execute()
    }

    override fun initObserve() {
        viewModel.userLiveData.observe(viewLifecycleOwner) {
            when (it.status) {
                Status.SUCCESS -> {
                    shareViewModel.setUser(it.data)
                    findNavController().navigate(R.id.action_splashFragment_to_mainFragment)
                }
                Status.ERROR -> {
                    context?.showToast(it.message)
                }
                else -> {
                }
            }
        }
    }
}